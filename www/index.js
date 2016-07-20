'use strict';

var Plotly = require('plotly.js');
var math = require('mathjs');

Plotly.register([require('../')]);

var transform = {
    type: 'expression',
    expr: 'x * 0.01 + y^2',
    ivar: ['x'],
    dvar: 'y'
};

var x = [];
var y = [];
var xmin = -20;
var xmax = 20;
var n = 1000;
for (var i = 0; i < n; i++) {
    x[i] = xmin + (xmax - xmin) * i / (n - 1);
    y[i] = Math.cos(x[i]) * Math.exp(-Math.pow(x[i] / 4, 2));
}

Plotly.plot('graph', [{
    x: x,
    y: y,
    type: 'scatter',
    mode: 'lines',
    transforms: [transform]
}]);

var expr = document.getElementById('expr');

function onchange () {
    try {
        math.compile(expr.value);
        transform.expr = expr.value;
        Plotly.restyle('graph', {'transform.expr': [transform.expr]}, [0]);
    } catch (e) {
    }
}

expr.addEventListener('input', onchange);
