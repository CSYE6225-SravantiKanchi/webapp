#!/bin/bash


#Making the libraries Upto Date
#sudo dnf update -y  #TODO: uncomment it

#install unzip
sudo dnf install -y unzip

# Setting up the database
sudo dnf install -y mysql-server
sudo systemctl start mysqld.service
sudo systemctl enable mysqld.service


mysqladmin -u root password "root" #TODO - check what to do here??


#npm setup
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
# export NVM_DIR="$HOME/.nvm"
#         [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
#         [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"    
sudo dnf install -y nodejs
node --version
