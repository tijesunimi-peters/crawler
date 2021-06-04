let fs = require("fs")
let { Console } = require("console")
let { LOG_FILE } = require('./constants.js')
let output = fs.createWriteStream(LOG_FILE) 

module.exports = new Console({ stdout: output, stderr: output })
