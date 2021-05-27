const lineReader = require("line-reader")
const { Queue } = require("node-resque")
const { redisConnection } = require("../config/node_resque.js")
const CsvLineParser = require("../services/csvLineParserService.js")

module.exports = {
  perform: (seeder_path) => {
    let queue = new Queue({ connection: redisConnection })
    let csvLine = new CsvLineParser();

    lineReader.eachLine(seeder_path, function(line) {
      if(line.includes("Rank")) {
        csvLine.buildHeader(line);
      } else {
        parsedCsvRow = csvLine.parseRow(line);
        queue.connect();
        queue.enqueue("domains", "webLoaderJob", parsedCsvRow)
      }
    })
  }

}
