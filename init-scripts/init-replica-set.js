// MongoDB Replica Set Initialization Script
// This script initializes a single-node replica set for development purposes

print("Starting MongoDB replica set initialization...");

// Wait for MongoDB to be ready
print("Waiting for MongoDB to be ready...");
while (!db.runCommand("ping").ok) {
    sleep(1000);
}

// Check if replica set is already initialized
try {
    const status = rs.status();
    if (status.ok === 1) {
        print("Replica set already initialized");
        quit(0);
    }
} catch (error) {
    print("Replica set not initialized, proceeding with initialization...");
}

// Initialize the replica set
print("Initializing replica set...");
const result = rs.initiate({
    _id: "rs0",
    members: [
        { _id: 0, host: "mongo-7-replica:27017" }
    ]
});

if (result.ok === 1) {
    print("Replica set configuration initiated successfully!");

    // Wait for primary election
    print("Waiting for primary election...");
    let attempts = 0;
    const maxAttempts = 30;

    while (!rs.isMaster().ismaster && attempts < maxAttempts) {
        sleep(1000);
        attempts++;
    }

    if (rs.isMaster().ismaster) {
        print("Replica set initialized successfully! Primary is ready.");
    } else {
        print("Warning: Primary election may still be in progress.");
    }
} else {
    print("Error initializing replica set:", result);
}
