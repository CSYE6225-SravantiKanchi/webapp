# WEBAPP Deployment Guide

## Overview

This README provides instructions for deploying the webapp on a CentOS server and for setting up the environment locally.

## About

This webapp is developed using Node.js in the Express framework with MySQL as the database. It features a user model with `first_name`, `last_name`, `password`, and `username` (where the username is an email address).

As of the current version, four APIs have been developed:
- `GET /heathz`: Checks the database connectivity.
- `GET /v1/user/self`: Returns the user info if provided valid basic authentication.
- `POST /v1/user`: Creates the user. This is an unauthenticated API.
- `PUT /v1/user/self`: Used to update one or many fields of the user.

For understanding the payload and schema requirements, refer to the Swagger documentation: [Cloud Native Webapp Swagger Docs](https://app.swaggerhub.com/apis-docs/csye6225-webapp/cloud-native-webapp/2024.spring.02).

The application handles 404 (Not Found), 405 (Method Not Allowed), and 400 (Bad Request) errors, ensuring that no payload is returned for these error responses.

## Prerequisites

- Sign up for Digital Ocean.
- Generate an SSH key to use during droplet creation.

- **Local Deployment Setup**
- For local deployment: Install MySQL, Git, Nvm
- Once the Nvm is installed, use Node.js version 18.x
```bash
    nvm install 18
    nvm use 18
```
- Clone the repository and select the Main Branch
- Only Main Branch contains the latest Code, do not clone other or fork branches

## CentOS Server Setup

- Log in to Digital Ocean.
- Select "Create a Droplet."
- Choose "New York" as the region and select data center 1.
- Select CentOS as the OS image with version 8 stream x64.
- Select a CPU option with basic SSD, and opt for 2 GB RAM / 1 CPU, 50 GB SSD, and 2 TB Transfer ($12 per hour).
- Configure the generated SSH public key ([adding SSH keys guide](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/create-with-openssh/)).
- Create the droplet and note down the public IPV4 address.

### Access the Server

To access the server, use OpenSSH:

```bash
ssh -i ~/.ssh/sshkeyname rootoruser@IPV4
```

### Downloading the Prerequisites for the Webapp in CentOS

After logging into the server, install and set up the following:

- **MySQL Server**: Install, enable, and start MySQL Server. Then, use `mysql_secure_installation` to set up the root password:

    ```bash
    dnf install mysql-server
    sudo systemctl start mysqld.service
    sudo systemctl enable mysqld.service
    sudo mysql_secure_installation
    ```

- **Node.js via NVM**: Install NVM, then install and use Node.js v18:

    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"    
    nvm install 18
    nvm use 18
    ```


- **Unzip Library**: To unzip the webapp repository, install the unzip library:

    ```bash
    dnf install unzip
    ```

### Deployment of WebApp (Locally / or in CentOS)


1. **Download the WebApp**: Download the zip file from the main branch of the webapp (ensure it is not from a forked repo).

2. **Transfer the WebApp**: Use the following SCP command to move the zip file from your system to the created CentOS Droplet:

    ```bash
    scp -i ~/.ssh/sshkeyname webapp-main.zip rootoruser@IPV4:/root
    ```

3. **Unzip the WebApp in CentOS**: Log in to the server using the access command mentioned above, then unzip the repository:

    ```bash
    unzip webapp-main.zip
    ```

4. **WebApp Directory**: Navigate to the webapp-main directory:

    ```bash
    cd webapp-main
    ```

5. **Install Dependencies**: Install the Node.js dependencies:

    ```bash
    npm install
    ```

6. **Environment Variables**: Create a `.env` file and add the following environmental variables:

    ```env
    PORT=8080
    NODE_ENV=DEV
    SQL_URI=mysql://user:password@localhost:3306
    DATABASE= yourDB
    ```

    Replace `user`, `password`, and `yourDB` with your actual database credentials.

7. **Start the WebApp**: To launch the server, run:

    ```bash
    npm run dev
    ```

8. **Validate the Testcases**:
 - Added test cases for Healthz API to validate, and will also be helpful for deployment check which we've added

    ```bash
    npm test
    ```

9. **Validate the Integration Testcases**:
 - Added test cases for create and update account by calling get account.
 - Added a jest configuration for this.

    ```bash
    npm run test:integration
    ```

### Conclusion

Follow these steps to deploy your web application on a CentOS server. Remember to replace placeholder values with actual data relevant to your setup.


##  Assignment 4 Packer Setup

### Packer automation

Added a packer script to create a custom CentOS 8 image that includes the following pre-installed components:

MySQL Server
Node.js (via npm, using version 18)
Unzip library
Web application source code, automatically unzipped
Node.js dependencies pre-installed
Systemd service setup for the web application
Additionally, the Packer script configures a non-login user csye6225 with ownership of the web application directory. The web application is configured to start automatically via a Systemd service file, ensuring that the application launches at boot time without manual intervention.

### Image Creation Process Overview

This project employs a GitHub Actions workflow for image creation on merging with main:

- **GCP Authentication**: Authenticates with Google Cloud Platform using a service account to manage resources.

- **Configuration & Packaging**:
  - Creates an `.env` file for necessary environment variables.
  - Zips the web application codebase for deployment.

- **Node.js & MySQL Installation**: Installs Node.js and MySQL to prepare the environment for the web application and its integration tests.

- **Integration Testing**: Executes integration tests to ensure seamless interaction between the web application and the database.

- **Packer Setup**: Installs Packer for automating the creation of a virtual machine image, including the web application and its dependencies.

- **Packer Image Creation**: Runs Packer to build a virtual machine image, ready for deployment with all required configurations and software.

### Packer Validation Overview
This project employs a GitHub Actions workflow for packer validation creation on raising pull requests with main

- Packer Format check 
- Packer Validate check


