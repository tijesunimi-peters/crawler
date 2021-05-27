const { redisConnection } = require("../config/node_resque.js")
const { Queue } = require("node-resque")
const PageWriter = require("../services/pageWriterService.js")
const { manifestFileService } = require("../services/manifestFileService.js")

module.exports = {
  queue: new Queue({connection: redisConnection}),
  perform: function(parsedCsvRow, pageContent) {
    PageWriter.write(parsedCsvRow, pageContent, manifestFileService)
  }
}
