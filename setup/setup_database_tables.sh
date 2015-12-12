#!/bin/bash

read -p "This script will setup your database for the first time. Please enter root password: " pw

#drop/create database
mysql -uroot -p$pw < setup/sql/v1_event.sql;

mysql -uroot -p$pw < files-api/sql/v1_file.sql;
mysql -uroot -p$pw < sessions-api/sql/v1_session.sql;
mysql -uroot -p$pw < users-api/sql/v1_user.sql;

echo "All good, cheers!"
