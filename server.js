var express = require('express');
const lodash = require('lodash'); 
const evilsrc = {constructor: {prototype: {evilkey: "evilvalue"}}};
// Object.freeze(Object.prototype);
lodash.defaultsDeep({}, evilsrc)

var app = express();
var password = "Ivan_jr22"

// set the view engine to ejs
app.set('view engine', 'ejs');
// static assets directory
app.use(express.static('public'));

// index page, this callback contains code that can be exploited for CVE-2022-29078 
app.get('/', function(req, res) {
  if (!req.query.hasOwnProperty('id')){
    req.query.id = 'Stranger';
  }
  res.render('pages/index',req.query);
});

if (require.main === module) {
  app.listen(3000);
  console.log('Server is listening on port 3000');
}

module.exports = app;

var session = require("express-session")
app.use(
  session({
    cookie: {
      domain: "domain.org",
      secure: true,
      httpOnly: false,
      name: "cookie",
      maxAge: 12 * 60 * 60 * 1000,
      path: "/",
    },
  })
)
