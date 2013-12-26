
/**
 * Module föggőségek.
 */

var mongoose = require('mongoose'),
    Workout = mongoose.model('Workout'),
    User = mongoose.model('User');

/**
 * Kezdőoldal (GET)
 */

exports.home = function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.render('home/home', {
      title: 'Főoldal'
    });
  }
};

/**
 * Dashboard (GET)
 */

exports.dashboard = function (req, res) {
  var page = req.param('page') > 0 ? req.param('page') : 0,
      perPage = 20,
      options = {
        perPage: perPage,
        page: page
      };

  Workout.list(options, function(err, workouts) {
    if (err) return res.render('500');
    Workout.count().exec(function (err, count) {
      var count = count,
          yesterday = new Date();
      
      //Tegnap beállítása
      yesterday.setDate(yesterday.getDate() - 1);
      
      Workout.find({ createdAt: {$gte: yesterday} }).count().exec(function(err, yesterdayCount){
        if (err) return res.render('500');
        User.count().exec(function (err,userCount) {
          if (err) return res.render('500');
          res.render('home/dashboard', {
            title: 'Edzésfal',
            workouts: workouts,
            page: page,
            count: count,
            yesterdayCount : yesterdayCount,
            userCount: userCount,
            pages: count / perPage
          });
        });
      });
    });
  });
};

/**
 * Oldalról (GET)
 */

exports.aboutUs = function(req, res) {
  res.render('home/about-us', {
    title: 'Oldalról'
  });
}

/**
 * Kapcsolat (GET)
 */

exports.contact = function(req, res) {
  res.render('home/contact', {
    title: 'Kapcsolat'
  });
}
