const fs = require("fs")
const path = require("path")
const { MANIFEST_FILE } = require("../config/constants.js")

function manifestFileService(err, hashLocation, parsedCsvRow) {
  if(err) throw err;
  console.log(`[Finished downloading]: ${parsedCsvRow.Domain}`)
  console.log(`Writing to manifest`)

  fs.appendFile(path.join(MANIFEST_FILE), JSON.stringify({...hashLocation, ...parsedCsvRow}) + `\r\n`, function(err) {
    if(err) throw err;

    console.log(`[${parsedCsvRow.Domain}]: Written to manifest`)
  })
}

module.exports = { manifestFileService }
