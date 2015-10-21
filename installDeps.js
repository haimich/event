var fs = require('fs');
var exec = require('child_process').exec;

fs.readFile('services.json', 'utf8', function (error, data) {
  var apps = (JSON.parse(data).apps);
  
  apps.forEach(function(app) {
    exec('cd ' + app.cwd + '&& npm install', function (error, stdout, stderr) {
      if (error !== null && error !== '') {
        throw new Error('An error occured: ' + error);
      }
      console.log('Installed npm dependencies for ' + app.cwd);
    });
  });
});