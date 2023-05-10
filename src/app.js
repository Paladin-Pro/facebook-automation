const config = require('./config');
const express = require('express');
const app = express();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const FACEBOOK_APP_ID = config.appId;
const FACEBOOK_APP_SECRET = config.appSecret;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // save the user's access token and profile data in a database or session
    return cb(null, profile);
  }
));

app.use(passport.initialize());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.post('/post', function(req, res) {
  var postLink = req.body.postLink;
  var action = req.body.action;
  var comment = req.body.comment;
  var username = req.user.displayName;

  var postId = postLink.split('/').pop();
  var profileId = req.user.id;

  switch(action) {
    case 'like':
      likePost(profileId, postId);
      break;
    case 'comment':
      commentOnPost(profileId, postId, comment);
      break;
    case 'react':
      reactToPost(profileId, postId);
      break;
    default:
      showError('Invalid action selected.');
      break;
  }

  res.redirect('/');
});

function likePost(profileId, postId) {
  FB.api(
      '/' + profileId + '_' + postId + '/likes',
      'POST',
      function(response) {
          if (response && !response.error) {
              showSuccess('Post liked successfully!');
          } else {
              showError('Error liking post: ' + response.error.message);
          }
      }
  );
}

function commentOnPost(profileId, postId, comment) {
  FB.api(
      '/' + profileId + '_' + postId + '/comments',
      'POST',
      { message: comment },
      function(response) {
          if (response && !response.error) {
              showSuccess('Comment added successfully!');
          } else {
              showError('Error adding comment: ' + response.error.message);
          }
      }
  );
}

function reactToPost(profileId, postId) {
  FB.api(
      '/' + profileId + '_' + postId + '/reactions',
      'POST',
      { type: 'LOVE' },
      function(response) {
          if (response && !response.error) {
              showSuccess('Post reacted to successfully!');
          } else {
              showError('Error reacting to post: ' + response.error.message);
          }
      }
  );
}

function showSuccess(message) {
  var resultDiv = document.getElementById('result');
  if (resultDiv) {
      resultDiv.innerHTML = message;
      resultDiv.className = 'success';
  } else {
      console.log(message);
  }
}

function showError(message) {
  var resultDiv = document.getElementById('result');
  if (resultDiv) {
      resultDiv.innerHTML = message;
      resultDiv.className = 'error';
  } else {
      console.log(message);
  }
}

app.listen(3000, function() {
  console.log('Server started on port 3000');
});
