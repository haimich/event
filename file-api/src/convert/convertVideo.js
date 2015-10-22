var childProcess = require('child_process');

function getConverter (callback) {
  var script = __dirname + '/bash/get-converter.sh';
  childProcess.exec('bash ' + script, function(error, stdout, stderr) {
    if (error === null) {
      callback(stdout);
    } else {
      throw new Error(stderr);
    }
  });
}

function startConverting(converter, filename, callback) {
  var script = __dirname + '/bash/convert-video.sh';
  childProcess.exec('bash ' + script + ' ' + filename + ' ' + converter, function(error, stdout, stderr) {
    if (error === null) {
      callback(stdout);
    } else {
      throw new Error(stderr);
    }
  });
}

exports.start = function(filename, callback) {
  getConverter(function(converter) {
    startConverting(converter, filename, callback);
  });
}

getConverter();