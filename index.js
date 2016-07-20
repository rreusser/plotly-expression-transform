'use strict';

var Lib = require('plotly.js/src/lib');
var math = require('mathjs');

exports.moduleType = 'transform';
exports.name = 'expression';

exports.attributes = {
    expr: {
        valType: 'string',
        dflt: 'x'
    },
    ivar: {
        valType: 'string',
        arrayOk: true,
        dflt: 'x'
    },
    dvar: {
        valType: 'string',
        dflt: 'y'
    }
};

exports.supplyDefaults = function(transformIn, fullData, layout) {
    var transformOut = {};

    function coerce(attr, dflt) {
        return Lib.coerce(transformIn, transformOut, exports.attributes, attr, dflt);
    }

    coerce('expr');
    coerce('ivar');
    coerce('dvar');

    return transformOut;
};

exports.transform = function(data, state) {
    var i, j, ivars, ivar;
    var trace = state.fullTrace;
    var transform = state.transform;
    var dvar = transform.dvar;

    var compiledExpr = math.compile(transform.expr);

    var vars = {}

    if (dvar) {
        vars[dvar] = trace[dvar];
    }

    if (Array.isArray(transform.ivar)) {
        ivars = transform.ivar;
    } else {
        ivars = [transform.ivar];
    }

    // Clone all the trace data:
    var out = trace[dvar] = trace[dvar].slice(0);

    var scope = {};

    for (i = 0; i < out.length; i++) {
        scope[dvar] = trace[dvar][i];

        for (j = 0; j < transform.ivar.length; j++) {
            ivar = transform.ivar[j];
            scope[ivar] = trace[ivar][i];
        }

        out[i] = compiledExpr.eval(scope);
    }

    return data;
};
