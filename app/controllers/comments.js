
/**
 * Module függőségek
 */

var mongoose = require('mongoose');

/**
 * Komment készítése
 */

exports.create = function (req, res) {
  var workout = req.workout;
  var user = req.user;

  if (!req.body.body) return res.redirect('/workouts/'+ workout.id);

  workout.comments.push({
    body: req.body.body,
    user: user._id
  });

  workout.save(function (err) {
    if (err) return res.render('500');
    res.redirect('/workouts/'+ workout.id);
  });
}
