#!/bin/bash

echo "=== Updating system packages ==="
apt-get update -y

echo "=== Installing Apache2 ==="
apt-get install -y apache2

# Change VM's webserver's configuration to use shared folder.
# (Look inside test-website.conf for specifics.)
cp /vagrant/test-website.conf /etc/apache2/sites-available/

# install our website configuration and disable the default provided by Apache
a2ensite test-website
a2dissite 000-default
service apache2 reload

echo "=== Provisioning finished successfully for webserver! ==="