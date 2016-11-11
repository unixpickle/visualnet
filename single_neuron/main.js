var VAR_NAMES = ['in1', 'in2', 'in3', 'w1', 'w2', 'w3'];
var VARS_WITH_OUT = VAR_NAMES.concat(['out']);
var app;

function handleLoad() {
  app = new App();
}

function zeroAll() {
  app.zeroAll();
}

function App() {
  this._sliders = {};
  this._valueLabels = {};
  this._diagram = new window.Diagram(VARS_WITH_OUT, this.get.bind(this));
  var t = document.getElementsByTagName('table')[0];
  for (var i = 0, len = VAR_NAMES.length; i < len; ++i) {
    var v = VAR_NAMES[i];
    var slider = document.createElement('input');
    this._sliders[v] = slider;
    slider.type = 'range';
    slider.min = -1;
    slider.max = 1;
    slider.step = 1e-4;
    slider.value = Math.random()*2 - 1;
    slider.addEventListener('change', this.updateValues.bind(this));
    slider.addEventListener('input', this.updateValues.bind(this));
    var valueLabel = document.createElement('td');
    this._valueLabels[v] = valueLabel;
    valueLabel.style.width = '45px';
    valueLabel.style.textAlign = 'right';
    var labelColumn = document.createElement('td');
    labelColumn.textContent = v;
    var row = document.createElement('tr');
    row.appendChild(labelColumn);
    row.appendChild(slider);
    row.appendChild(valueLabel);
    t.appendChild(row);
  }
  this.updateValues();
}

App.prototype.get = function(varName) {
  if (varName === 'out') {
    var output = 0;
    for (i = 1; i <= 3; ++i) {
      output += this.get('w'+i) * this.get('in'+i);
    }
    return output;
  }
  return parseFloat(this._sliders[varName].value);
};

App.prototype.zeroAll = function() {
  for (var i = 0, len = VAR_NAMES.length; i < len; ++i) {
    this._sliders[VAR_NAMES[i]].value = 0;
  }
  this.updateValues();
};

App.prototype.updateValues = function() {
  this._diagram.update();
  for (var i = 0, len = VAR_NAMES.length; i < len; ++i) {
    var v = VAR_NAMES[i];
    var value = this.get(v);
    this._valueLabels[v].textContent = value.toFixed(2);
  }
  document.getElementById('answer').textContent = this.get('out').toFixed(2);
};
