const { redisConnection } = require("../config/node_resque.js")
const { Queue } = require("node-resque")
const webLoader = require("../services/webLoaderService.js")
const { manifestFileService } = require("../services/manifestFileService.js")

module.exports = {
  perform: async (parsedCsvRow) => {
    let queue = new Queue({ connection: redisConnection })
    try {
      let response = await webLoader(parsedCsvRow)
      await queue.connect();
      queue.enqueue("page-writer", "pageWriterJob", [parsedCsvRow, response.data, manifestFileService])
    } catch(err) {
      console.log(`[${parsedCsvRow.Domain}]: `, err.message)
    }
  }
}
