'use strict';

var Plotly = require('plotly.js');
var math = require('mathjs');
var beautify = require('json-beautify');
Plotly.register([require('../')]);
Plotly.register([require('plotly-basis-transform')]);

var dim = 1;

var transforms1D = [{
    type: 'basis',
    variable: 'x',
    range: [-20, 20],
    npoints: 1000,
}, {
    type: 'expression',
    expr: 'cos(x) * exp(-(x / 4)^2)',
    dvar: 'y',
    ivar: 'x'
}];

var transforms2D = [{
    type: 'basis',
    variable: 'x',
    range: [-20, 20],
    npoints: 100,
}, {
    type: 'basis',
    variable: 'y',
    range: [-20, 20],
    npoints: 100,
}, {
    type: 'expression',
    expr: 'r = sqrt(x^2 + y^2), cos(r) * exp(-(r / 8)^2)',
    dvar: 'z',
    ivar: ['x', 'y']
}];

window.curTr = function curTr () {
    return traces[dim - 1]
};

function exprTr () {
    return traces[dim - 1].transforms[traces[dim - 1].transforms.length - 1];
}

var $toggleJSON = document.getElementById('show-json');
$toggleJSON.addEventListener('click', toggleJSON);

function toggleJSON() {
    var $jsonContainer = document.getElementById('json-container');

    if ($jsonContainer.style.display === 'block') {
        $toggleJSON.classList.remove('active');
        $toggleJSON.textContent = 'Show JSON';
        $jsonContainer.style.display = 'none';
    } else {
        $toggleJSON.classList.add('active');
        $toggleJSON.textContent = 'Hide JSON';
        $jsonContainer.style.display = 'block';
    }


    var $jsonContent = document.getElementById('json-content');
    var header = document.getElementById('header');
    var headerHeight = header.offsetHeight;

    $jsonContainer.style.top = headerHeight + 'px';
    $jsonContent.textContent = beautify(curTr(), null, 2);

}

function setDim (i) {
    dim = i;
    expr.value = exprTr().expr;

    var $1Dcontrols = document.getElementById('plot-1d-controls');
    var $2Dcontrols = document.getElementById('plot-2d-controls');
    var $3Dcontrols = document.getElementById('plot-3d-controls');

    if (dim > 2) {
        $2Dcontrols.style.display = 'inline-block';
        $3Dcontrols.style.display = 'inline-block';
    } else if (dim > 1) {
        $2Dcontrols.style.display = 'inline-block';
        $3Dcontrols.style.display = 'none';
    } else {
        $2Dcontrols.style.display = 'none';
        $3Dcontrols.style.display = 'none';
    }

    onlimits();

    return Plotly.deleteTraces('graph', [0]).then(function () {
        return Plotly.addTraces('graph', traces[dim - 1]);
    }).then(function () {
        return onchange();
    });
}

var x = [1];
var y = [1];
var z = [[1]];
var xmin = -4;
var xmax = 4;
var ymin = -4;
var ymax = 4;
var zmin = -20;
var zmax = 20;
var n = 1000;

var xmaxEl = document.getElementById('xmax');
var xminEl = document.getElementById('xmin');
var ymaxEl = document.getElementById('ymax');
var yminEl = document.getElementById('ymin');
var zmaxEl = document.getElementById('zmax');
var zminEl = document.getElementById('zmin');
xmaxEl.addEventListener('input', limitsAndChange);
xminEl.addEventListener('input', limitsAndChange);
ymaxEl.addEventListener('input', limitsAndChange);
yminEl.addEventListener('input', limitsAndChange);
zmaxEl.addEventListener('input', limitsAndChange);
zminEl.addEventListener('input', limitsAndChange);

function limitsAndChange () {
    onlimits();
    onchange();
}

var traces = [
    {x: x, y: y, type: 'scatter', mode: 'lines', transforms: transforms1D},
    {x: x, y: y, z: z, type: 'surface', transforms: transforms2D}
];

var layout = {
    margin: {
        t: 0
    }
};

Plotly.plot('graph', [traces[dim - 1]], layout, {scrollZoom: true});

var expr = document.getElementById('expr');
expr.value = exprTr().expr;

function onchange () {
    try {
        math.compile(expr.value.split(','));
        exprTr().expr = expr.value;
        return Plotly.restyle('graph', {transform: [traces[dim - 1].transform]}, [0]).then(function () {
            return Plotly.redraw('graph');
        });
    } catch (e) {
        console.warn(e)
    }
}

expr.addEventListener('input', limitsAndChange);

function onresize () {
    var controls = document.getElementById('controls');
    var header = document.getElementById('header');
    var controlHeight = controls.offsetHeight;
    var headerHeight = header.offsetHeight;

    var graph = document.getElementById('graph');
    graph.style.top = headerHeight;

    Plotly.relayout('graph', {
        width: window.innerWidth,
        height: window.innerHeight - controlHeight - headerHeight
    });
}

window.addEventListener('resize', onresize);
window.onload = onresize;

function onlimits () {
    var i, j;
    xmin = parseFloat(xminEl.value);
    xmax = parseFloat(xmaxEl.value);
    ymin = parseFloat(yminEl.value);
    ymax = parseFloat(ymaxEl.value);
    zmin = parseFloat(zminEl.value);
    zmax = parseFloat(zmaxEl.value);

    traces[dim - 1].transforms[0].range[0] = xmin;
    traces[dim - 1].transforms[0].range[1] = xmax;

    if (dim > 1) {
        traces[dim - 1].transforms[1].range[0] = xmin;
        traces[dim - 1].transforms[1].range[1] = xmax;
    }
}

var $1D = document.getElementById('plot-1d');
var $2D = document.getElementById('plot-2d');
var $3D = document.getElementById('plot-3d');

$1D.addEventListener('click', function () {
    n = 1000;
    setDim(1);
    $1D.classList.add('active');
    $2D.classList.remove('active');
    $3D.classList.remove('active');
});

$2D.addEventListener('click', function () {
    n = 100;
    setDim(2);
    $1D.classList.remove('active');
    $2D.classList.add('active');
    $3D.classList.remove('active');
});

$3D.addEventListener('click', function () {
    setDim(3);
    $1D.classList.remove('active');
    $2D.classList.remove('active');
    $3D.classList.add('active');
});
