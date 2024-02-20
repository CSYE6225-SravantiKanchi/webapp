echo "web application service starting now"

#creating a folder where we need unzip the webapp
sudo mkdir /home/csye6225/webapp

#moving it to csye6225 user directory
sudo mv ~/webapp_main.zip /home/csye6225/webapp

#unzipping the zip file
sudo unzip /home/csye6225/webapp/webapp_main.zip -d /home/csye6225/webapp

#removing zip the webapp_main
sudo rm /home/csye6225/webapp/webapp_main.zip

#installing the libraries
sudo npm install --prefix /home/csye6225/webapp/

#changing the ownership
sudo chown -R csye6225:csye6225 /home/csye6225/webapp/

#moving the weapp.service to systemd path
sudo cp /home/csye6225/webapp/webapp.service /lib/systemd/system/webapp.service

#reloading the system services
sudo systemctl daemon-reload

#starting and enalbing the webapp
sudo systemctl start webapp #TODO : fail if it doesn't work
sudo systemctl enable webapp  