const fs = require("fs")
const path = require("path")
const https = require("https")
const PageWriter = require("./pageWriter.js")
const axios = require("axios")
const { MANIFEST_FILE } = require("../config/constants.js")

const webLoader = function(parsedCsvRow) {
  console.log("Downloading ", parsedCsvRow.Domain);

  const hashLocation = PageWriter.hashLocation(parsedCsvRow)

  if(PageWriter.pageExists(hashLocation.path)) {
    console.log(`Page with url ${parsedCsvRow.Domain} already exists`)
    return;
  }

  function writeManifest(err) {
    if(err) throw err;
    console.log(`[Finished downloading]: ${parsedCsvRow.Domain}`)
    console.log(`Writing to manifest`)

    fs.appendFile(path.join(MANIFEST_FILE), JSON.stringify({...hashLocation, ...parsedCsvRow}) + `\r\n`, function(err) {
      if(err) throw err;

      console.log(`[${parsedCsvRow.Domain}]: Written to manifest`)
    })
  }

  axios.get(`https://${parsedCsvRow.Domain}`)
    .then(function(response) {
      PageWriter.write(parsedCsvRow, response.data, writeManifest)
    })
    .catch(function(err) {
      console.log(`[${parsedCsvRow.Domain}]: `, err.message)
    })
}


module.exports = webLoader;
