var express = require('express');
var router = express.Router();
const fs = require('fs');
const { findcompanies, getcompanies } = require('../companiesscript.js');


/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.query.search && req.query.search.length !== 0) {
    console.log('Lähen search funktsiooni sisse.');
    const search = req.query.search;
    function send(name) {
      res.json(name);
    };
    findcompanies(search, send);
    ;
  }

  else if (!isNaN(req.query.regcode) && req.query.regcode.length !== 0) {
    console.log('Lähen regcode funktsiooni sisse.');
    const regcode = req.query.regcode;
    function send(name) {
      res.json(name);
    };
    getcompanies(regcode, send);
  }
  else {
    res.status(501).json({ message: 'Parameters not correctly provided' });
  };
});

module.exports = router;
