var express = require('express');
var router = express.Router();
let multer = require("multer")

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "seed/")
  },
  filename: function(req, file, cb){
    return cb(null, file.fieldname + ".csv");
  },
})

let uploadFolder = multer({ storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('domains', { title: 'Domains Form' });
});

router.post('/', uploadFolder.single('domains-csv'), function(req, res, next) {
  res.redirect("/domains?result=successful") 
})

module.exports = router;
