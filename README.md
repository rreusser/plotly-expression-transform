# plotly-expression-transform

> A plotly transform for evaluating arbitrary functions

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

## Introduction

Highly experimental. Have realized I did the syntax all wrong. This module applies the transform `dvar ← f(dvar, ivar)` where `dvar` is a dependent variable and `ivar` is a single independent variable (or an array of independent variables).

## Installation
Currently requires experimental plotly.js PR for transforms. Example requires unpublished module. Not published to npm. Can add to `package.json` from repo directly:

```javscript
  "plotly-expresson-transform": "https://github.com/rreusser/plotly-expression-transform.git"
```

## Example

```javascript
var Plotly = require('plotly.js');

Plotly.register([require('plotly-expression-transform')]);

Plotly.plot('graph', [{
    x: [...],
    y: [...],
    transforms: {
        type: 'expression',
        expr: 'x * 0.01 + y^2',
        dvar: 'y',
        ivar: 'x'
    }
}]);

```

## License

&copy; 2016 Ricky Reusser. MIT License.
