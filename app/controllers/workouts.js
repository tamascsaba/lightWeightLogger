
/**
 * Module függőséges.
 */

var mongoose = require('mongoose'),
    express = require('express'),
    async = require('async'),
    Workout = mongoose.model('Workout'),
    _ = require('underscore');

/**
 * Edzés keresése id alapján
 */

exports.workout = function(req, res, next, id){
  var User = mongoose.model('User');

  Workout.load(id, function (err, workout) {
    if (err) return next(err);
    if (!workout) return next(new Error('Nem sikerült betölteni az edzést :(' + id));
    req.workout = workout;
    next();
  })
}

/**
 * Új edzés (GET)
 */

exports.new = function(req, res){
  if(!req.xhr) {
    res.render('workouts/new', {
      title: 'Új Edzés',
      workout: new Workout({})
    });
  } else {
    res.render('workouts/xhr/new', {
      workout: new Workout({})
    });
  }
}

/**
 * Edzés elkészítése (POST)
 */

exports.create = function (req, res) {
  var workout = new Workout(req.body);

  console.log(req.body);

  workout.user = req.user;

  workout.uploadAndSave(req.user, function (err) {
    // Error
    if (err) {
      if(!req.xhr) {
        res.render('workouts/new', {
          title: 'Új Edzés',
          workout: workout,
          errors: err.errors
        });
      } else {
        res.status(403).render('workouts/xhr/new', {
          workout: workout,
          errors: err.errors
        });
      }
    // No Error
    } else {
        if(!req.xhr) {
          res.redirect('/dashboard');
       } else {
          res.status(200).end('Light Weight :)');
        }
    }
  });
}

/**
 * Edzés szerkesztése (GET)
 */

exports.edit = function (req, res) {
  res.render('workouts/edit', {
    title: req.workout.title + ' szerkesztése',
    workout: req.workout
  })
}

/**
 * Edzés frissítése (POST)
 */

exports.update = function(req, res){
  var workout = req.workout;
  workout = _.extend(workout, req.body);

  console.log(workout);

  workout.uploadAndSave(req.user,function(err) {
    if (err) {
      res.render('workouts/edit', {
        title: 'Edzés szerkesztése',
        workout: workout,
        errors: err.errors
      });
    }
    else {
      res.redirect('/workouts/' + workout._id);
    }
  });
}

/**
 * Edzés megtekintése (GET)
 */

exports.show = function(req, res){
  res.render('workouts/show', {
    title: req.workout.title,
    workout: req.workout
  });
}

/**
 * Edzés törlése (POST)
 */

exports.destroy = function(req, res){
  var workout = req.workout;
  workout.remove(function(err){
    // req.flash('notice', 'Törlés sikeres!');
    res.redirect('/dashboard');
  });
}

/**
 * Edzések listája
 */

exports.index = function(req, res){
  var page = req.param('page') > 0 ? req.param('page') : 0;
  var perPage = 15;
  var options = {
    perPage: perPage,
    page: page
  }


  Workout.list(options, function(err, workouts) {
    if (err) return res.render('500');
    Workout.count().exec(function (err, count) {
      res.render('workouts/index', {
        title: 'List of Workouts',
        workouts: workouts,
        page: page,
        pages: count / perPage
      });
    });
  });
}

/**
 * Saját edzéseim
 */

exports.my = function(req, res){
  var userId = req.user._id;

  Workout
    .find({ user: userId })
    .sort({createdAt: -1 })
    .populate('user')
    .exec(function(err, workouts) {
      if (err) return res.render('500');
      res.render('workouts/my', {
        title: 'Saját edzéseim',
        workouts: workouts
      });
    });
}
