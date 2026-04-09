#!/bin/bash

# Setup script to fix MongoDB replica set permissions
echo "Setting up MongoDB replica set permissions..."

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    echo "Creating data directory..."
    mkdir -p data
fi

# Set proper permissions for data directory
echo "Setting permissions for data directory..."
chmod 755 data

# Set proper permissions for mongodb-keyfile
echo "Setting permissions for mongodb-keyfile..."
chmod 600 mongodb-keyfile

# Change ownership of data directory to match MongoDB user (999:999)
echo "Changing ownership of data directory to MongoDB user (999:999)..."
sudo chown -R 999:999 data

# Verify permissions
echo "Verifying permissions..."
ls -la data
ls -la mongodb-keyfile

echo "Setup complete! You can now run: docker-compose up -d"
