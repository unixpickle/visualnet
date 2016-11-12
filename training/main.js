var STEP_SIZE = 0.3;
var FRAME_RATE = 24;
var VAR_NAMES = ['in1', 'in2'];
var EDITABLE = ['in1', 'in2'];
var diagram = null;
var variableValues = {};
var trainInterval = null;

for (var i = 1; i <= 3; ++i) {
  var bias = 'n' + i + '-b';
  EDITABLE.push(bias);
  VAR_NAMES.push(bias);
  VAR_NAMES.push('n' + i + '-out');
  VAR_NAMES.push('a' + i + '-out');
  for (var j = 1; j <= 2; ++j) {
    var weight = 'n' + i + '-w' + j;
    EDITABLE.push(weight);
    VAR_NAMES.push(weight);
  }
}

function handleLoad() {
  diagram = new window.Diagram(VAR_NAMES, getDiagramValue);
  reset();
}

function reset() {
  for (var i = 0, len = VAR_NAMES.length; i < len; ++i) {
    variableValues[VAR_NAMES[i]] = Math.random() - 0.5;
  }
  variableValues.in1 = 0;
  variableValues.in2 = 0;
  diagram.update();
}

function startStop(target) {
  if (trainInterval !== null) {
    target.textContent = 'Start';
    clearInterval(trainInterval);
    trainInterval = null;
    return;
  }
  target.textContent = 'Stop';

  var iteration = 0;
  trainInterval = setInterval(function() {
    if ((iteration&1) === 0) {
      var sample = (iteration >> 1);
      variableValues.in1 = randomBit();
      variableValues.in2 = randomBit();
    } else {
      gradientDescent();
    }
    diagram.update();
    ++iteration;
  }, 1000/FRAME_RATE);
}

function gradientDescent() {
  var gradVars = EDITABLE.slice();
  gradVars.splice(gradVars.indexOf('in1'), 1);
  gradVars.splice(gradVars.indexOf('in2'), 1);
  var gradient = {};
  for (var i = 0, len = gradVars.length; i < len; ++i) {
    var varName = gradVars[i];
    var backup = variableValues[varName];
    variableValues[varName] += 0.0001;
    var old1 = getDiagramValue('n3-out');
    variableValues[varName] -= 0.0002;
    var old2 = getDiagramValue('n3-out');
    variableValues[varName] = backup;
    gradient[varName] = (old1 - old2) / 0.0002;
  }
  var desired = variableValues.in1 ^ variableValues.in2;
  var out = getDiagramValue('n3-out');
  // Sigmoid + cross-entropy
  var outGrad = (Math.exp(out)*(desired-1)+desired) / (Math.exp(out)+1);
  for (var i = 0, len = gradVars.length; i < len; ++i) {
    var varName = gradVars[i];
    variableValues[varName] += outGrad * gradient[varName] * STEP_SIZE;
  }
}

function getDiagramValue(name) {
  switch (name) {
  case 'n1-out':
  case 'n2-out':
    var neuronName = name.substr(0, 2);
    return getDiagramValue('in1')*getDiagramValue(neuronName+'-w1') +
      getDiagramValue('in2')*getDiagramValue(neuronName+'-w2') +
      getDiagramValue(neuronName+'-b');
  case 'a1-out':
  case 'a2-out':
  case 'a3-out':
    var neuronName = 'n' + name[1] + '-out';
    return sigmoid(getDiagramValue(neuronName));
  case 'n3-out':
    return getDiagramValue('a1-out')*getDiagramValue('n3-w1') +
      getDiagramValue('a2-out')*getDiagramValue('n3-w2') +
      getDiagramValue('n3-b');
  default:
    return variableValues[name] || 0;
  }
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function randomBit() {
  return Math.random() > 0.5 ? 1 : 0;
}
