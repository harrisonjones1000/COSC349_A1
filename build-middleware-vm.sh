#!/bin/bash
set -e

echo "=== Updating system packages ==="
apt-get update

# Install curl if missing
if ! command -v curl >/dev/null 2>&1; then
    echo "=== Installing curl ==="
    apt-get install -y curl
fi

# Install Node.js 22.x only if not already installed
# v22 specifically opposed to Ubunuts default
if ! command -v node >/dev/null 2>&1 || [[ $(node -v) != v22* ]]; then
    echo "=== Adding NodeSource repo for Node.js 22.x ==="
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    echo "=== Installing Node.js and npm ==="
    apt-get install -y nodejs
fi

echo "=== Entering project folder ==="
cd /vagrant

echo "=== Installing npm dependencies ==="
npm install

echo "=== Starting server in background ==="
nohup node server.js &

echo "=== Provisioning finished successfully! ==="
