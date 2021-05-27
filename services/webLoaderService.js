const fs = require("fs")
const path = require("path")
const https = require("https")
const PageWriter = require("./pageWriterService.js")
const axios = require("axios")
const { MANIFEST_FILE } = require("../config/constants.js")

const webLoader = async function(parsedCsvRow) {
  console.log("Downloading ", parsedCsvRow.Domain);

  const hashLocation = PageWriter.hashLocation(parsedCsvRow)

  if(PageWriter.pageExists(hashLocation.path)) {
    console.log(`Page with url ${parsedCsvRow.Domain} already exists`)
    return;
  }

  return await axios.get(`https://${parsedCsvRow.Domain}`)
}


module.exports = webLoader;
