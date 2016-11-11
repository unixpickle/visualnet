(function() {

  var NUM_RANGE = 1;

  function Diagram(varNames, getter) {
    this._varNames = varNames;
    this._getter = getter;
  }

  Diagram.prototype.update = function() {
    for (var i = 0, len = this._varNames.length; i < len; ++i) {
      var name = this._varNames[i];
      var value = this._getter(name);
      var element = document.getElementById(name);
      updateElement(element, value);
    }
  };

  function updateElement(el, val) {
    if ('undefined' !== typeof el.setAttribute) {
      el.setAttribute('color', numberColor(val));
    }
    if (el.tagName.toLowerCase() === 'line') {
      updateLine(el, val);
    } else if (el.tagName.toLowerCase() === 'circle') {
      updateCircle(el, val);
    }
    for (var i = 0, len = el.children.length; i < len; ++i) {
      updateElement(el.children[i], val);
    }
  }

  function updateLine(el, val) {
    var minWidth = parseFloat(el.getAttribute('data-minwidth'));
    var maxWidth = parseFloat(el.getAttribute('data-maxwidth'));
    var diff = (maxWidth - minWidth) / NUM_RANGE;

    var boost = el.getAttribute('data-limitboost');
    if (boost) {
      boost = parseFloat(boost);
      maxWidth = (maxWidth - minWidth)*boost + minWidth;
    }

    var width = Math.max(minWidth, Math.min(maxWidth, Math.abs(val)*diff + minWidth));
    el.setAttribute('stroke-width', width.toFixed(2));
  }

  function updateCircle(el, val) {
    var minRadius = parseFloat(el.getAttribute('data-minradius'));
    var maxRadius = parseFloat(el.getAttribute('data-maxradius'));
    var diff = (maxRadius - minRadius) / NUM_RANGE;

    var radius = Math.max(minRadius, Math.min(maxRadius, Math.abs(val)*diff + minRadius));
    el.setAttribute('r', radius.toFixed(2));
  }

  function numberColor(num) {
    var amountPos = Math.min(1, Math.max(0, (num + NUM_RANGE) / (2*NUM_RANGE)));
    var mergeVals = function(x, y) {
      var res = Math.round(amountPos*x + (1-amountPos)*y).toString(16);
      if (res.length == 2) {
        return res;
      } else {
        return '0' + res;
      }
    };
    var r = mergeVals(0x6f, 0xe0);
    var g = mergeVals(0xa8, 0x66);
    var b = mergeVals(0xdc, 0x66);
    return '#' + r + g + b;
  }

  window.Diagram = Diagram;

})();
