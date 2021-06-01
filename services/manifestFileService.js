const fs = require("fs")
const path = require("path")
const { MANIFEST_FILE } = require("../config/constants.js")
let { redis } = require("../config/node_resque.js")

function manifestFileService(err, hashLocation, parsedCsvRow) {
  if(err) throw err;
  console.log(`[Finished downloading]: ${parsedCsvRow.Domain}`)
  console.log(`Writing to manifest`)


  redis.hset("domains-metadata", hashLocation.md5, JSON.stringify({...hashLocation, ...parsedCsvRow}), function(err) {
    if(err) throw err;

    console.log(`[${parsedCsvRow.Domain}]: Written to manifest`)
  })
}

module.exports = { manifestFileService }
