const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const FACEBOOK_APP_ID = 'YOUR_APP_ID';
const FACEBOOK_APP_SECRET = 'YOUR_APP_SECRET';

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}));

const config = {
  appId: FACEBOOK_APP_ID,
  appSecret: FACEBOOK_APP_SECRET,
  redirectUri: 'https://localhost:8080/',
  apiVersion: 'v12.0',
};

module.exports = config;
