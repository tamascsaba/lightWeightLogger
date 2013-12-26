
var async = require('async')

module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users');

  app.get('/user/login', users.login);
  app.get('/user/register', users.register);
  app.get('/user/logout', users.logout);
  app.post('/user/create', users.create);
  app.post('/user/session', users.session);
  app.get('/user/:userId', auth.requiresLogin, users.show);
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin);
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback);
  app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin);
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback);
  app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin);
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback);
  app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.signin);
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.authCallback);

  app.param('userId', users.user);

  // workout routes
  var workouts = require('../app/controllers/workouts');
  app.get('/workouts', workouts.index);
  app.get('/workouts/my', workouts.my);
  app.get('/workouts/new', auth.requiresLogin, workouts.new);
  app.post('/workouts', auth.requiresLogin, workouts.create);
  app.get('/workouts/:id', workouts.show);
  app.get('/workouts/:id/edit', auth.requiresLogin, auth.workout.hasAuthorization, workouts.edit);
  app.put('/workouts/:id', auth.requiresLogin, auth.workout.hasAuthorization, workouts.update);
  app.del('/workouts/:id', auth.requiresLogin, auth.workout.hasAuthorization, workouts.destroy);

  app.param('id', workouts.workout);

  // home route
  var home = require('../app/controllers/home');
  app.get('/', function(req, res){ req.isAuthenticated() ? res.redirect('/dashboard') : res.redirect('/home')});
  app.get('/home', home.home);
  app.get('/dashboard',auth.requiresLogin, home.dashboard);
  app.get('/about-us', home.aboutUs);
  app.get('/contact', home.contact);



  // comment routes
  var comments = require('../app/controllers/comments');
  app.post('/workouts/:id/comments', auth.requiresLogin, comments.create);

  // tag routes
  var tags = require('../app/controllers/tags');
  app.get('/tags/:tag', tags.index);

}
