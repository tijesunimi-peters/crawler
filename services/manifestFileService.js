const fs = require("fs")
const path = require("path")
const { MANIFEST_FILE } = require("../config/constants.js")
let { redis } = require("../config/node_resque.js")
const logger = require("../config/logger.js")

function manifestFileService(err, hashLocation, parsedCsvRow) {
  if(err) logger.error(err);
  logger.log(`[Finished downloading]: ${parsedCsvRow.Domain}`)
  logger.log(`Writing to manifest`)


  redis.hset("domains-metadata", hashLocation.md5, JSON.stringify({...hashLocation, ...parsedCsvRow}), async function(err) {
    if(err) logger.error(err);

    await redis.rpush("domains-id", hashLocation.md5, function(err) {
      logger.error(err)
    })

    logger.log(`[${parsedCsvRow.Domain}]: Written to manifest`)
  })
}

module.exports = { manifestFileService }
