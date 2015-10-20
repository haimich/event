var proxy = require('redbird')({port: 8080});

proxy.register('localhost', "http://www.google.de");