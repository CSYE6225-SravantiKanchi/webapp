#!/bin/bash
set -e

sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*

#Making the libraries Upto Date
# sudo dnf update -y

#install unzip
sudo dnf install -y unzip

#installing ops-agent
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

#node v18.X setup
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -   
sudo dnf install -y nodejs
node --version
