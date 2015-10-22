var childProcess = require('child_process');

function getConverter (callback) {
  var script = __dirname + '/bash/get-converter.sh';
  childProcess.exec('bash ' + script, function(error, stdout, stderr) {
    if (error === null) {
      callback(stdout.replace('\n', ''));
    } else {
      throw new Error(stderr);
    }
  });
}

function startConverting(converter, filename, outputPath, callback) {
  var script  = __dirname + '/bash/convert-video.sh',
      command = 'bash ' + script + ' ' + filename + ' ' + converter + ' ' + outputPath;
  
  childProcess.exec(command, function(error, stdout, stderr) {
    if (error !== null) {
      callback('Converting failed: ' + stderr, stdout);
    } else {
      var outputFiles = [];
      //remove empty lines
      stdout.split('\n').forEach(function(element) {
        if (element !== '') {
          outputFiles.push(element);
        }
      });
      callback(null, outputFiles);
    }
  });
}

exports.start = function(filename, outputPath, callback) {
  getConverter(function(converter) {
    startConverting(converter, filename, outputPath, callback);
  });
}