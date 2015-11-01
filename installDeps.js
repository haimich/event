var fs = require('fs');
var cd = require('shelljs').cd,
    exec = require('shelljs').exec;

var pm2Config = 'services.json';

console.log('Installing dependencies for apps from file ' + pm2Config);

fs.readFile(pm2Config, 'utf8', function (error, data) {
  var apps = (JSON.parse(data).apps);
  
  apps.forEach(function(app) {
    cd(__dirname + '/' + app.cwd);
    
    exec('npm install', { async: true, silent: true }, function(code, output) {
      if (code !== 0) {
        console.log(':( Got error for ' + app.cwd);
        console.log('Error output:', output);
      } else {
        console.log(':) ' + app.cwd);
      }
    });
  });
});