var express = require('express');
var router = express.Router();
var fs = require('fs')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Our APP' });
});

router.get('/login', function(req, res, next) {
  res.render('login', {message: req.flash('loginMessage') });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
  });

module.exports = router;
