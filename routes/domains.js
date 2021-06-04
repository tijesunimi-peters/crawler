var express = require('express');
var router = express.Router();
let multer = require("multer")
let worker = require("../worker.js")
let { SEEDER_DIR } = require("../config/constants.js")
let { Queue } = require("node-resque")

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "seed/")
  },
  filename: function(req, file, cb){
    return cb(null, file.fieldname + ".csv");
  },
})

let uploader = multer({ storage }).single('domains-csv')

router.get('/', function(req, res, next) {
  res.render('domains', { title: 'Domains Form' });
});

router.post('/', uploader, async function(req, res, next) {
  try {
    let queue = new Queue({ connection: require("../config/node_resque.js").redisConnection })
    await queue.connect()
    await queue.enqueue("domain-files", "domainsCsvReaderJob", [req.file.path])
    res.redirect("/domains?result=successful") 
  } catch(err) {
    next(err)
  }
})

module.exports = router;
