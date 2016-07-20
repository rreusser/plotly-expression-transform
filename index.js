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
        dflt: undefined
    },
    dvar: {
        valType: 'string',
        dflt: undefined
    },
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
    var newData = data.map(function(trace) {
        return transformOne(trace, state);
    });

    return newData;
};

function transformOne(trace, state) {
    var i, j, ivar;
    var transform = state.transform;
    var expr = transform.expr;
    var parsedExpr = math.parse(expr);
    var compiledExpr = math.compile(expr);
    var npoints = transform.npoints;
    var xmin = transform.xmin;
    var xmax = transform.xmax;

    var vars = {};
    var varNames = [];

    if (transform.dvar) {
        var dvar = vars[transform.dvar] = trace[transform.dvar];
        varNames.push(transform.dvar);
    }
    if (transform.ivar) {
        if (Array.isArray(transform.ivar)) {
            for (i = 0; i < transform.ivar.length; i++) {
                ivar = transform.ivar;
                vars[ivar] = trace[ivar];
                varNames.push(ivar);
            }
        } else {
            vars[transform.ivar] = trace[transform.ivar];
            varNames.push(transform.ivar);
        }
    }

    var varNames = Object.keys(vars);

    //if (npoints && npoints > 0) {
        //for (i = 0; i < npoints; i++) {
            //x[i] = xmin + (xmax - xmin) * i / (npoints - 1);
        //}
    //}

    var len = dvar.length;
    for (i = 0; i < len; i++) {
        var vals = {};
        for (j = 0; j < varNames.length; j++) {
            var varName = varNames[j];
            vals[varName] = vars[varName][i];
        }

        dvar[i] = compiledExpr.eval(vals);
    }

    return trace;
}
