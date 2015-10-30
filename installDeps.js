var fs = require('fs');
var exec = require('child_process').exec;

fs.readFile('ecosystem.json', 'utf8', function (error, data) {
  var apps = (JSON.parse(data).apps);
  var additionalApps = ['modules/message-queue']

  // add message-queue
  apps.push({cwd : 'modules/message-queue'});

  apps.forEach(function(app) {
    exec('cd ' + app.cwd + '&& npm install', function (error, stdout, stderr) {
      if (error !== null && error !== '') {
        throw new Error('An error occured: ' + error);
      }
      console.log('Install npm dependencies for ' + app.cwd);
    });
  });
});