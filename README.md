# plotly-expression-transform

> A plotly transform for evaluating arbitrary functions

## Example

``javascript
var Plotly = require('plotly.js');

Plotly.register([require('plotly-expression-transform')]);

Plotly.plot('graph', [{
    x: [1],
    y: [1],
    transforms: [{
        type: 'expression',
        expr: 'cos(x) * exp(-(x / 4)^2)',
        xmin: -20,
        xmax: 20,
        npoints: 1000,
    }]
}]);

```

## License

&copy; 2016 Ricky Reusser. MIT License.
