#!/bin/bash

read -p "This script will setup your database for the first time. Press Enter to continue"
read -p "Enter mysql root pw: " pw

#drop/create database
mysql -uroot -p$pw < sql/v1_event.sql;

mysql -uroot -p$pw < session-api/sql/v1_session.sql;
mysql -uroot -p$pw < file-api/sql/v1_file.sql;
mysql -uroot -p$pw < user-api/sql/v1_user.sql;

echo "All good, cheers!"