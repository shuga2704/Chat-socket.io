const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const server = require('http').Server(app);
const io = require('socket.io')(server, { serverClient: true });
const mongoose = require('mongoose');
const passport = require('passport');
const { Strategy } = require('passport-jwt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { jwt } = require('./config');

passport.use(new Strategy(jwt, function (jwt_payload, done) {
  if (jwt_payload != void (0)) return done(false, jwt_payload);
  done();
}));

mongoose.connect('mongodb://localhost:27017/chatik', { useNewUrlParser: true });
mongoose.Promise = require('bluebird');
mongoose.set('debug', true);

nunjucks.configure('./client/views', {
  autoescape: true,
  express: app
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

require('./router')(app);
require('./sockets')(io);

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});