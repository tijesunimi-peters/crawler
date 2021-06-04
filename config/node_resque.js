let redis = require("redis")

const redisConnection = {
  pkg: "ioredis",
  host: process.env.REDIS_URL,
  password: null,
  port: 6379,
  database: 0,
  namespace: "crawler:",
}

module.exports = { redisConnection, redis: redis.createClient(process.env.REDIS_URL, { prefix: "crawler:"}) }
