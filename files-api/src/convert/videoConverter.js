'use strict';

let childProcess = require('child_process'),
    path = require('path');

function getConverter() {
  return new Promise((resolve, reject) => { 
    let script = path.join(__dirname, '/bash/get-converter.sh');
    childProcess.exec('bash ' + script, (error, stdout, stderr) => {
      if (error !== null) {
        reject(stderr);
      } else {
        resolve(stdout.replace('\n', ''));
      }
    });
  });
}

function startConverting(converter, filename, outputPath) {
  let script  = path.join(__dirname, '/bash/convert-video.sh'),
      command = `bash ${script} ${filename} ${converter} ${outputPath}`;
  
  return new Promise((resolve, reject) => { 
    childProcess.exec(command, function(error, stdout, stderr) {
      if (error) {
        reject('Converting failed: ' + stderr);
      } else {
        console.log(getOutputFiles(stdout));
        resolve(getOutputFiles(stdout));
      }
    });
  });
}

function getOutputFiles(stdout) {
  let outputFiles = [];
  //remove empty lines
  stdout.split('\n').forEach((element) => {
    if (element !== '') {
      let split = element.split('=');
      outputFiles.push({
        mimetype: split[0],
        filesystemLocation: split[1]
      });
    }
  });
  return outputFiles;
}

module.exports.convert = (filename, outputPath) => {
  return getConverter()
    .then((converter) => {
      return startConverting(converter, filename, outputPath);
    });
}