'use strict';

var Lib = require('plotly.js/src/lib');
var Parser = require('js-expression-eval').Parser;

exports.moduleType = 'transform';
exports.name = 'expression';

exports.attributes = {
    expr: {
        valType: 'string',
        dflt: 'x'
    },
    xmin: {
        valType: 'number',
        dflt: 0
    },
    xmax: {
        valType: 'number',
        dflt: 1
    },
    npoints: {
        valType: 'number',
        dflt: undefined
    },
};

exports.supplyDefaults = function(transformIn, fullData, layout) {
    var transformOut = {};

    function coerce(attr, dflt) {
        return Lib.coerce(transformIn, transformOut, exports.attributes, attr, dflt);
    }

    coerce('expr');
    coerce('xmin');
    coerce('xmax');
    coerce('npoints');

    return transformOut;
};

exports.transform = function(data, state) {
    var newData = data.map(function(trace) {
        return transformOne(trace, state);
    });

    return newData;
};

function transformOne(trace, state) {
    var i;
    var expr = state.transform.expr;
    var parsedExpr = Parser.parse(expr);
    var npoints = state.transform.npoints;
    var xmin = state.transform.xmin;
    var xmax = state.transform.xmax;

    function evaluate (x) {
        return parsedExpr.evaluate({x: x});
    }

    var x = trace.x;
    var y = trace.y;

    if (npoints && npoints > 0) {
        for (i = 0; i < npoints; i++) {
            x[i] = xmin + (xmax - xmin) * i / (npoints - 1);
        }
    }

    var len = x.length;
    for (i = 0; i < len; i++) {
        y[i] = evaluate(x[i]);
    }

    return trace;
}
