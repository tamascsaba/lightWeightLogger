
/**
 * Module föggőségek.
 */

var mongoose = require('mongoose'),
    Workout = mongoose.model('Workout');

/**
 * Tag alapján kilistázza az össes beletartózó elemet
 */

exports.index = function (req, res) {
  var tag = req.param('tag'),
      criteria = { tags: tag },
      perPage = 15,
      page = req.param('page') > 0 ? req.param('page') : 0;

  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  };

  Workout.list(options, function(err, workouts) {
    if (err) return res.render('500');
    Workout.count(criteria).exec(function (err, count) {
      res.render('workouts/index', {
        title: 'Tag: ' + tag,
        workouts: workouts,
        page: page,
        count: count,
        pages: count / perPage
      });
    });
  });
}
