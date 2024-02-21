#!/bin/bash
set -e

#creating a user group
sudo groupadd -f csye6225

#adding a user with nologin and adding it to csye6225 group
sudo useradd -s /usr/sbin/nologin -g csye6225 csye6225