/**
 * Module dependencies.
 */

var express = require('express'),
    util = require('util'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
    expressValidator = require('express-validator'),
    captcha = require('captcha');

module.exports = function (app, config, passport) {

  app.set('showStackError', true);
  app.use(express.compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }));
  app.use(express.logger('dev'));

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  app.use(express.static(config.root + '/public'));

  
  app.configure(function () {
    app.use(helpers(config.app.name));
    app.locals({
      title: config.app.name,
      keywords: config.app.keywords,
      description: config.app.description,
      pretty : true
    });
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(expressValidator);
    app.use(express.cookieSession({ secret: 'titkos-sózós-kulcs' }));
    app.use(captcha({ url: '/captcha.jpg', color:'#1D354D', background: '#ffffff' }));
    app.use(express.session({
      secret: 'nagyon-titkos-dolog',
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.favicon());
    app.use(app.router);
    
    app.use(function(err, req, res, next){
      if (~err.message.indexOf('not found')) return next()
      console.error(err.stack);
      res.status(500).render('500', { error: err.stack });
    });
    app.use(function(req, res, next){
      res.status(404).render('404', { url: req.originalUrl });
    });

  });

}
