
/**
 * Module függőségek.
 */

var mongoose = require('mongoose'),
    passport = require('passport'),
    expressValidator = require('express-validator'),
    captcha = require('captcha'),
    User = mongoose.model('User');

exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
  res.redirect('/');
};

/**
 * Bejelentkezés (GET)
 */

exports.login = function (req, res) {
  if(!req.xhr) {
    res.render('users/login', {
      title: 'Bejelentkezés',
      message: req.flash('error')
    });
  } else {
    res.render('users/xhr/login', {
      message: req.flash('error')
    });
  }
};

/**
 * Regisztráció (GET)
 */

exports.register = function (req, res) {
  if( !req.xhr ) {
    res.render('users/register', {
      title: 'Regisztráció',
      user: new User(),
      errors: {}
    });
  } else {
    res.render('users/xhr/register', {
      user: new User(),
      errors: {}
    });
  }
};

/**
 * Kijelentkezés
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/home');
};

/**
 * Session
 */

exports.session = function(req, res, next) {
  if(!req.xhr) {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/user/login',
      failureFlash: 'Rossz felhasználónév vagy jelszó!'
    })(req, res, next);
  } else {
    passport.authenticate('local', function(err, user, info) {
      //Login Failed
      if (err) { return next(err) }
      if (!user) {
        req.flash('error', 'Rossz felhasználónév vagy jelszó!');
        return res.status(403).render('users/xhr/login', {message: req.flash('error')});
      }
      //Login Succes :)
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.status(200).end('Light Weight :)');
      });
    })(req, res, next);
  }
};

/**
 * User készítése (POST)
 */

exports.create = function (req, res) {

  // Validáció
  req.assert('name', 'Nem adtad meg a neved!').notEmpty();
  req.assert('email', 'Érvényes e-mail címet kell megadnod!').isEmail();
  req.assert('password', 'Jelszadnak legalább 6 karakteresnek kell lennie (max 20)!').len(6,20);
  req.assert('username', 'Felhasználóneved minimum 4 karakter és csak angol ábécé betűi lehetnek!').is(/[a-zA-Z]+$/).min(4);
  req.assert('digits', 'Nem megfelelő ellenőrzőkódot írtál be!').is(req.session.captcha);
  
  var errors = req.validationErrors();
  var user = new User(req.body);
  if (!errors) {
    user.provider = 'local';
    user.save(function (err) {
      //  Hiba esetén :(
      if (err) {
        req.flash('errors', 'Hiba történt kérlek próbáld meg újra!');
        if(!req.xhr) {
          return res.status(403).res.render('users/register', { errors: req.flash('errors'), user: user });
        } else {
          return res.render('users/xhr/register', { errors: req.flash('errors'), user: user });
        }
      }
      // Egyébként bejelentkeztetjük :)
      req.logIn(user, function(err) {
        if (err) return next(err);
          if(!req.xhr) {
            res.redirect('/dashboard');
          } else {
            return res.status(200).end('Light Weight :)');
          }
      });
    });
  } else {
    req.flash('errors', errors);
    if(!req.xhr) {
      res.render('users/register', { errors: req.flash('errors'), user: user });
    } else {
      res.status(403).render('users/xhr/register', { errors: req.flash('errors'), user: user });
      console.log("ssss");
    }
  }
};

/**
 *  Profil (GET)
 */

exports.show = function (req, res) {
  var user = req.profile;
  res.render('users/show', {
    title: user.name,
    user: user
  });
};

/**
 * User keresése ID alapján
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Nem sikerült betölteni a felhasználót id: ' + id));
      req.profile = user;
      next();
    });
};
