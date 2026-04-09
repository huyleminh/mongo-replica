# MongoDB 7 Replica Set

This directory contains a Docker Compose setup for MongoDB 7 with replica set support for development.

## Features

- MongoDB 7.0 with replica set configuration
- Single-node replica set for development
- Authentication enabled with key file
- Health checks and proper initialization
- Persistent data storage
- External client access support

## Prerequisites

### 1. Generate MongoDB Key File

MongoDB replica sets require a key file for inter-replica authentication:

```bash
# Generate a secure key file
openssl rand -base64 756 > mongodb-keyfile

# Set proper permissions (required for security)
chmod 600 mongodb-keyfile
```

### 2. Add Hostname Mapping

For external clients to connect, add this to your `/etc/hosts` file:

```bash
echo "127.0.0.1 mongo-7-replica" | sudo tee -a /etc/hosts
```

This allows external clients to resolve `mongo-7-replica` to `localhost`.

### 3. Environment Configuration

Create a `.env` file with your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your preferred credentials:
```env
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=your_secure_password
```

## Usage

1. **Start the MongoDB replica set:**
   ```bash
   docker compose up -d
   ```

2. **Check the status:**
   ```bash
   docker compose ps
   ```

3. **View logs:**
   ```bash
   docker compose logs -f mongo-7-replica
   ```

4. **Connect to MongoDB:**

   **Using mongosh:**
   ```bash
   mongosh "mongodb://root:your_password@mongo-7-replica:27018/?replicaSet=rs0&authSource=admin"
   ```

   **Using MongoDB Compass:**
   ```
   mongodb://root:your_password@mongo-7-replica:27018/?replicaSet=rs0&authSource=admin
   ```

   **Using Mongoose/Node.js:**
   ```javascript
   const uri = "mongodb://root:your_password@mongo-7-replica:27018/your_database?replicaSet=rs0&authSource=admin";
   ```

## Configuration

- **External Port**: 27018 (mapped to internal 27017)
- **Replica Set Name**: rs0
- **Data Directory**: `./data`
- **Init Scripts**: `./init-scripts`
- **Key File**: `./mongodb-keyfile`

## Environment Variables

- `MONGO_ROOT_USERNAME`: MongoDB root username (default: root)
- `MONGO_ROOT_PASSWORD`: MongoDB root password (default: root)

## Important Notes

### 🔐 Security
- The key file (`mongodb-keyfile`) is required for replica set authentication
- Key file permissions must be 600 (readable only by owner)
- Never commit the key file to version control

### 🌐 Network Access
- External clients must use `mongo-7-replica:27018` (not `localhost:27018`)
- The `/etc/hosts` mapping is required for hostname resolution
- Internal Docker communication uses `mongo-7-replica:27017`

### 🔄 Replica Set
- Single-node replica set (perfect for development)
- Uses external port in replica set configuration for client compatibility
- Authentication required for all operations

## Troubleshooting

### Connection Issues
```bash
# Check if containers are running
docker-compose ps

# Check replica set status
docker exec -it mongo-7-replica mongosh --username root --password your_password --authenticationDatabase admin --eval "rs.status()"

# Test connection
docker exec -it mongo-7-replica mongosh --username root --password your_password --authenticationDatabase admin
```

### Reset Everything
```bash
# Stop and remove all data
docker-compose down -v

# Remove data directory
rm -rf data/*

# Restart fresh
docker-compose up -d
```

### Common Issues
- **Authentication failed**: Make sure to include `&authSource=admin` in connection string
- **Connection refused**: Verify `/etc/hosts` mapping and port 27018
- **Replica set not initialized**: Check logs with `docker-compose logs mongo-init`

## File Structure

```
mongo-replica/
├── docker-compose.yml          # Main configuration
├── mongodb-keyfile            # Authentication key (generated)
├── .env                       # Environment variables
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── data/                     # MongoDB data directory
├── init-scripts/             # Initialization scripts
│   └── init-replica-set.js   # Replica set setup
└── README.md                 # This file
```
