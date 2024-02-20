#!/bin/bash


#Making the libraries Upto Date
sudo dnf update -y

#install unzip
sudo dnf install -y unzip

# Setting up the database
sudo dnf install -y mysql-server
sudo systemctl start mysqld.service
sudo systemctl enable mysqld.service


mysqladmin -u root password "root" #TODO - check what to do here??


#node v18.X setup
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -   
sudo dnf install -y nodejs
node --version
