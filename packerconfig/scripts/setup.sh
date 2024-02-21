#!/bin/bash


#Making the libraries Upto Date
sudo dnf update -y

#install unzip
sudo dnf install -y unzip

# Setting up the database
sudo dnf install -y mysql-server
sudo systemctl start mysqld.service
sudo systemctl enable mysqld.service

sudo echo $DB_PASSWORD
mysqladmin -u $DB_USER password $DB_PASSWORD


#node v18.X setup
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -   
sudo dnf install -y nodejs
node --version
