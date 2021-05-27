const lineReader = require("line-reader")
const webLoader = require("./webLoader.js")
const CsvLineParser = require("./csvLineParser.js")

const Crawler = function() {
  function crawl(seeder_path) {
    let csvLine = new CsvLineParser();
    console.log(seeder_path)
    lineReader.eachLine(seeder_path, function(line) {
      if(line.includes("Rank")) {
        csvLine.buildHeader(line);
      } else {
        console.log(line)
        parsedCsvRow = csvLine.parseRow(line);
        webContent = webLoader(parsedCsvRow); 
      }
    })
  }

  return { crawl  }
}


module.exports = Crawler()
