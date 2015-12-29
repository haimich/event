let request = require('request-promise');
let baseUrl = 'http://localhost:8080/event/api';

function startConvertProcess(files) {
  let promises = [];
  
  for (let file of files) {
    promises.push(request({
      url: baseUrl + '/files/' + file.id + '/convert',
      method: 'PATCH'
    }));
  }
  
  return Promise.all(promises);
}

module.exports = {
  startConvertProcess
};