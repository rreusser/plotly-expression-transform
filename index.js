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

    var compiledExpr = math.compile(transform.expr.split(','));

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

    var dim = 0;
    var ptr = out;
    while(Array.isArray(ptr)) {
        dim++;
        ptr = ptr[0];
    }

    out = trace[dvar] = [];

    switch (dim) {
        case 1:
            var n = Math.max(out.length, trace[transform.ivar[0]].length);

            for (i = 0; i < n; i++) {
                scope[dvar] = trace[dvar][i];

                if (scope[dvar] === undefined) {
                    scope[dvar] = 0;
                }

                for (j = 0; j < transform.ivar.length; j++) {
                    ivar = transform.ivar[j];
                    scope[ivar] = trace[ivar][i];
                }

                for(var l = 0; l < compiledExpr.length; l++) {
                    out[i] = compiledExpr[l].eval(scope);
                }
            }
            break;
        case 2:
            var len = [trace[transform.ivar[0]].length, trace[transform.ivar[1]].length];

            for (i = 0; i < len[0]; i++) {
                scope[transform.ivar[0]] = trace[transform.ivar[0]][i];

                if (!out[i]) {
                    out[i] = [];
                }

                for (j = 0; j < len[1]; j++) {
                    scope[transform.ivar[1]] = trace[transform.ivar[1]][j];
                    scope[dvar] = trace[dvar][i][j];

                    for(var l = 0; l < compiledExpr.length; l++) {
                        out[i][j] = compiledExpr[l].eval(scope);
                    }
                }
            }

            break;
    }

    return data;
};
