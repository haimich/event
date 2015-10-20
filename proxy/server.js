var proxy = require('redbird')({port: 8080});

proxy.register('localhost/event/api/user', "http://localhost:3001/user");