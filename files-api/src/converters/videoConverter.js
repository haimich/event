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

/**
 * Starts the convert process.
 * 
 * @param converter the video converter to use
 * @param filename input file
 * @param outputPath where to store the converted files
 * @return the location and mimetypes of the output files
 */
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

/**
 * Extracts the names of the output files from a stdout string.
 * 
 * Example output: [{ mimetype: 'webm', filesystemLocation: 'upload/abc.webm' }]
 * 
 * @param stdout Output from convert process 
 * @return array
 */
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

/**
 * Convert a video file into webm and mp4.
 * 
 * @param filename
 * @param outputPath
 * 
 * @return the location of the output files 
 */
function convert(filename, outputPath) {
  return getConverter()
    .then(converter => startConverting(converter, filename, outputPath));
}

module.exports = {
  convert, getOutputFiles
}