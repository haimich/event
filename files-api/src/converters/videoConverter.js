'use strict';

let childProcess = require('child_process');
let path = require('path');

function getConverter() {
  return new Promise((resolve, reject) => { 
    let script = path.join(__dirname, '/bash/get-converter.sh');
    childProcess.exec('bash ' + script, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout.replace('\n', ''));
      }
    });
  });
}

function startConverting(converter, filename, outputPath) {
  return new Promise((resolve, reject) => {
    let script  = path.join(__dirname, '/bash/convert-video.sh');
    let command = `bash ${script} ${filename} ${converter} ${outputPath}`;
  
    childProcess.exec(command, (error, stdout, stderr) => {
      if (error) {
        reject('Converting failed: ' + stderr);
      } else {
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

function convert(filename, outputPath) {
  return getConverter()
    .then(converter => startConverting(converter, filename, outputPath));
}

module.exports = {
  convert
}