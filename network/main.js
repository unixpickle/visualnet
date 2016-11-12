var VAR_NAMES = ['in1', 'in2'];

for (var i = 1; i <= 3; ++i) {
  VAR_NAMES.push('n' + i + '-b');
  VAR_NAMES.push('n' + i + '-out');
  VAR_NAMES.push('a' + i + '-out');
  for (var j = 1; j <= 2; ++j) {
    VAR_NAMES.push('n' + i + '-w' + j);
  }
}

function handleLoad() {
  var d = new window.Diagram(VAR_NAMES, function() {
    return 0;
  });
  d.update();
}

function zeroAll() {
  // TODO: this.
}
