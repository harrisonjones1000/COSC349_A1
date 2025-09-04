#!/bin/bash
set -e

echo "=== Updating system packages ==="
apt-get update -y
apt-get upgrade -y

echo "=== Installing curl ==="
apt-get install -y curl

echo "=== Adding NodeSource repo for Node.js 22.x ==="
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

echo "=== Installing Node.js and npm ==="
apt-get install -y nodejs

echo "=== Entering project folder ==="
cd /vagrant

echo "=== Installing npm dependencies ==="
npm install

echo "=== Starting server in background ==="
nohup node server.js &

echo "=== Provisioning finished successfully! ==="
