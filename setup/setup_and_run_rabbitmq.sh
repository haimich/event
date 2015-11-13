#!/bin/bash

# Make sure only root can run our script
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

if dpkg-query -W rabbitmq-server > /dev/null; then
	echo "rabbitmq is already installed."
else
	apt-get update
	apt-get install -y rabbitmq-server
	service rabbitmq-server start 
fi
rabbitmq-plugins enable rabbitmq_management # available via port 55672
service rabbitmq-server restart
