var VAR_NAMES = ['in1', 'in2'];
var EDITABLE = ['in1', 'in2'];
var diagram = null;
var variableValues = {};

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
  setupEditing();
  randomize();
}

function zeroAll() {
  window.stopEditingNode();
  for (var i = 0, len = VAR_NAMES.length; i < len; ++i) {
    variableValues[VAR_NAMES[i]] = 0;
  }
  diagram.update();
}

function randomize() {
  window.stopEditingNode();
  for (var i = 0, len = VAR_NAMES.length; i < len; ++i) {
    variableValues[VAR_NAMES[i]] = Math.max(-1, Math.min(1, Math.random()*3 - 1.5));
  }
  diagram.update();
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
    return hyperbolicTangent(getDiagramValue(neuronName));
  case 'n3-out':
    return getDiagramValue('a1-out')*getDiagramValue('n3-w1') +
      getDiagramValue('a2-out')*getDiagramValue('n3-w2') +
      getDiagramValue('n3-b');
  default:
    return variableValues[name] || 0;
  }
}

function hyperbolicTangent(x) {
  return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
}

function setupEditing() {
  var curEditing = null;
  var editView = document.getElementById('edit-view');
  var editSlider = document.getElementById('edit-slider');
  var editLabel = document.getElementById('edit-label');
  for (var i = 0, len = EDITABLE.length; i < len; ++i) {
    (function(elem) {
      elem.addEventListener('click', function(e) {
        e.stopPropagation();
        if (curEditing) {
          highlightCircle(curEditing, false);
        }
        highlightCircle(elem, true);
        curEditing = elem;

        editView.className = 'enabled';
        var value = variableValues[elem.id] || 0;
        editSlider.value = value;
        editLabel.textContent = value.toFixed(2);
      });
    })(document.getElementById(EDITABLE[i]));
  }
  window.stopEditingNode = function() {
    if (curEditing) {
      highlightCircle(curEditing, false);
      curEditing = null;
      editView.className = 'disabled';
    }
  };
  document.body.addEventListener('click', function(e) {
    if (e.target === document.body || e.target.tagName === 'svg') {
      window.stopEditingNode();
    }
  });
  editSlider.addEventListener('input', function() {
    var value = parseFloat(editSlider.value);
    variableValues[curEditing.id] = value;
    editLabel.textContent = value.toFixed(2);
    diagram.update();
  });
}

function highlightCircle(el, highlighted) {
  if (el.tagName.toLowerCase() === 'circle') {
    if (highlighted) {
      el.setAttribute('class', 'highlighted');
    } else {
      el.setAttribute('class', '');
    }
  } else {
    for (var i = 0, len = el.children.length; i < len; ++i) {
      highlightCircle(el.children[i], highlighted);
    }
  }
}
