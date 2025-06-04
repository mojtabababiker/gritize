#!/bin/bash

# Check if codename is provided as argument
if [ $# -eq 0 ]; then
  echo "Usage: $0 <ubuntu-codename>"
  echo "Example: $0 noble"
  exit 1
fi

# Ubuntu codename from CLI argument
CODENAME=$1

# clean up previous install
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done

sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras;

sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd

sudo rm /etc/apt/sources.list.d/docker.list
sudo rm /etc/apt/keyrings/docker.asc

# Update and install dependencies
sudo apt-get update
sudo apt-get install -y ca-certificates curl

# Add Docker's GPG key
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository for Ubuntu Noble
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $CODENAME stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index
sudo apt-get update

echo "\n\nInstaling...."
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
