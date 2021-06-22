const fs = require("fs")
const path = require("path")
const https = require("https")
const PageWriter = require("./pageWriterService.js")
const axios = require("axios")
const { MANIFEST_FILE } = require("../config/constants.js")
const logger = require("../config/logger.js")
let { redis } = require("../config/node_resque.js")

const webLoader = async function(parsedCsvRow) {
  logger.log("Downloading ", parsedCsvRow.Domain);

  const hashLocation = PageWriter.hashLocation(parsedCsvRow)

  if(PageWriter.pageExists(hashLocation.path)) {
    logger.log(`Page with url ${parsedCsvRow.Domain} already exists`)
    await redis.rpush("domains-id", hashLocation.md5, function(err) {
      logger.error(err)
    })
    return;
  }

  return await axios.get(`https://${parsedCsvRow.Domain}`)
}


module.exports = webLoader;
