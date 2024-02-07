# WEBAPP Deployment Guide

## Overview

This README provides instructions for deploying the webapp on a CentOS server and setting up the environment locally.

## About

TODO

## Prerequisites

- Digital Ocean Signup.
- Generate an SSH Key, to provide this during droplet creation.

## CentOS Server Setup
- Login to the Digital Ocean 
- Select Signup a Droplet
- Select Region as  Newyork, and the data center 1
- Choose CentOS as OS Image with version as 8 stream x64
- select CPU with basic SSD , and opt for 2 GB RAM / 1 CPU 50 GB SSD and 2 TOB Transfer ($12 / hour)
- Configure the generated SSH public key - (https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/create-with-openssh/)
- Create the Droplet, and note down the public IPV4

### Access the Server
- For Accessing the server, we will use the openSSH

```bash
ssh -i ~/.ssh/sshkeyname root@IPV4
```

### Downloading the Prerequisites of Webapp
- After logging into the server, install and setup the following

- Install, Enable and Start the server using following three commands. Then using mysql_secure_installation setup the root password.

```bash
    dnf install mysql-server
    sudo systemctl start mysqld.service
    sudo systemctl enable mysqld.service
    sudo mysql_secure_installation
```

- For Node.js, Install NVM using the following command, later install Node v18 and use v18 as default

```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    nvm install 18
    nvm use 18
```

- For unzip our repo, install unzip libaray using the following command

```bash
    dnf install unzip
```


### Deployment of WebApp
 - first download the zip from the main branch of webapp (make sure it is not from forked repo).
 - Use the following SCP command to move the xip file from our system to the Created CentOS Droplet
```bash
     scp -i  ~/.ssh/sshkeyname webapp-main.zip root@IPV4:/root
```
- Then login into the server using the above mentioned access command.
- unzip the repo using the following command

```bash
    unzip webapp-main.zp
```
 - Then open the webapp-main directory
 - Install the Node dependencies using the following command

 ```bash
    npm install
 ```
 - Create a .env file and Add the following Environmental Variables

 ```env
    PORT=8080
    NODE_ENV=DEV
    SQL_URI=mysql://user:password@localhost:3306/yourDB
 ```

 - Then to make the server up, run the following command

 ```bash
    npm run dev
 ```
