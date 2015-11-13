var args = require('minimist')(process.argv.slice(2));

var fs = require('fs');
var cd = require('shelljs').cd,
    exec = require('shelljs').exec;

var pm2Config = args.config || args.c;

if (pm2Config === undefined) {
  throw new Error('No config file given. Specify with config=<path>');
}

console.log('Installing dependencies for apps from file ' + pm2Config);

var file = fs.readFileSync(pm2Config);
var apps = JSON.parse(file).apps;

apps.forEach(installDependencies);

function installDependencies(app) {
  cd(__dirname + '/' + app.cwd);
  
  exec('npm install', { async: true, silent: true }, function(code, output) {
    if (code !== 0) {
      console.log(':( Got error for ' + app.cwd);
      console.log('Error output:', output);
    } else {
      console.log(':) ' + app.cwd);
    }
  });
}