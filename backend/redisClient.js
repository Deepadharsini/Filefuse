const Redis = require('ioredis');

// Connect to a single Redis instance
const client = new Redis({
  host: 'localhost', // Redis host
  port: 6379, // Redis port

});

(async () => {
    // Set and assert
    const setResult = await client.set("key", "value");
    console.assert(setResult === "OK");

    // Get and assert
    const getResult = await client.get("key");
    console.assert(getResult === "value");
    
    // Close the connection
    client.disconnect();
})();
