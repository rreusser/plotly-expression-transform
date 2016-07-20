'use strict';

var Plotly = require('plotly.js');
var math = require('mathjs');

var xmaxEl = document.getElementById('xmax');
xmaxEl.addEventListener('input', onlimits);
var xminEl = document.getElementById('xmin');
xminEl.addEventListener('input', onlimits);

Plotly.register([require('../')]);

var transform = {
    type: 'expression',
    expr: 'x * 0.01 + y^2'
};

var x = [];
var y = [];
var xmin = -20;
var xmax = 20;
var n = 1000;

onlimits();

Plotly.plot('graph', [{
    x: x,
    y: y,
    type: 'scatter',
    mode: 'lines',
    transforms: [transform]
}], {
    margin: {t: 30}
});

var expr = document.getElementById('expr');
expr.value = transform.expr;

function onchange () {
    try {
        math.compile(expr.value);
        transform.expr = expr.value;
        Plotly.restyle('graph', {transform: [transform]}, [0]).then(function () {
            Plotly.redraw('graph');
        });
    } catch (e) {
    }
}

expr.addEventListener('input', onchange);


function onresize () {
    var controls = document.getElementById('controls');
    var controlHeight = controls.offsetHeight;

    Plotly.relayout('graph', {
        width: window.innerWidth,
        height: window.innerHeight - controlHeight
    });
}

window.addEventListener('resize', onresize);
window.onload = onresize;

function onlimits () {
    xmin = parseFloat(xminEl.value);
    xmax = parseFloat(xmaxEl.value);

    for (var i = 0; i < n; i++) {
        x[i] = xmin + (xmax - xmin) * i / (n - 1);
        y[i] = Math.cos(x[i]) * Math.exp(-Math.pow(x[i] / 4, 2));
    }

    onchange();
}
