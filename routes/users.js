var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(501).json({message: "No such route"});
});

module.exports = router;
