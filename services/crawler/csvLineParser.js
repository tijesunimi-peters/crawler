function CsvLineParser() {
  this.header = {}

  let splitLine = (line) => {
    return line.split(",").map(c => c.replace(/("|')/g, ""))
  }

  this.buildHeader = function(line) {
    splitLine(line).forEach((column) => {
      this.header[column] = column;
    })
  }

  this.parseRow = function(rawRow) {
    let values = rawRow.split(",").map(c => c.replace(/("|')/g, ""))
    let row = {}

    Object.values(this.header).forEach(function(column, index) {
      row[column] = values[index]
    });

    return row;
  }

  return this;
}

module.exports = CsvLineParser
