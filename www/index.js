'use strict';

var Plotly = require('plotly.js');
var Parser = require('js-expression-eval').Parser;

Plotly.register([require('../')]);

var transform = {
    type: 'expression',
    expr: 'cos(x) * exp(-(x / 4)^2)',
    xmin: -20,
    xmax: 20,
    npoints: 1000,
};

Plotly.plot('graph', [{
    x: [1],
    y: [1],
    type: 'scatter',
    mode: 'lines',
    transforms: [transform]
}]);

var expr = document.getElementById('expr');

function onchange () {
    try {
        Parser.parse(expr.value);
        transform.expr = expr.value;
        Plotly.restyle('graph', {'transform.expr': [transform.expr]}, [0]);
    } catch (e) {
    }
}

expr.addEventListener('input', onchange);
