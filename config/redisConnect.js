// config/redisConfig.js

const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

console.log("Redis client->", client);

client.on("error", (err) => {
  console.error(`Redis error: ${err}`);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

module.exports = {
  client,
  getAsync,
  setAsync,
  delAsync,
};
