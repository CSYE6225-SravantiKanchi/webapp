set -e

#creating a folder where we need unzip the webapp
sudo mkdir /home/csye6225/webapp

#unzipping the zip file
sudo unzip /tmp/webapp_main.zip -d /home/csye6225/webapp

#removing zip the webapp_main
sudo rm /tmp/webapp_main.zip

#installing the libraries
sudo npm install --prefix /home/csye6225/webapp/

#changing the ownership
sudo chown -R csye6225:csye6225 /home/csye6225/webapp/

#moving the weapp.service to systemd path
sudo cp /home/csye6225/webapp/webapp.service /etc/systemd/system/webapp.service

#reloading the system services
sudo systemctl daemon-reload

#starting and enalbing the webapp
sudo systemctl start webapp
sudo systemctl enable webapp  