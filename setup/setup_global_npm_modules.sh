#!/bin/bash

## pm2 process manager
npm install -g pm2

#auto complete
pm2 completion install
pm2 completion >> ~/.bashrc
source ~/.bashrc

#logrotate
pm2 install pm2-logrotate
pm2 set pm2-logrotate:retain 7

## Testing engine
npm install -g mocha

## Grunt (for apidocs only)
npm install -g grunt-cli