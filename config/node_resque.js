const redisConnection = {
  pkg: "ioredis",
  host: process.env.REDIS_HOST,
  password: null,
  port: 6379,
  database: 0,
  namespace: "resque:crawler",
}

module.exports = { redisConnection }
