'use strict';

var Plotly = require('plotly.js');

Plotly.register([require('../')]);

Plotly.plot('graph', [{
    x: [1],
    y: [1],
    type: 'scatter',
    mode: 'lines',
    transforms: [{
        type: 'expression',
        expr: 'cos(x) * exp(-(x / 4)^2)',
        xmin: -20,
        xmax: 20,
        npoints: 1000,
    }]
}]);

