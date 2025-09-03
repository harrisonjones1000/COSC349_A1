#!/bin/bash
set -e

# Update packages
apt-get update

# Install Node.js & npm
apt-get install -y nodejs npm

# Go to shared folder
cd /vagrant

# Install dependencies (npm = node package manager)
npm install

# Start server in background
nohup node server.js > /vagrant/server.log 2>&1 &
