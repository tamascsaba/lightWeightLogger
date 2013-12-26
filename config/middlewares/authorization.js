
/*
 *  Viszgáljuk, hogy a user be van-e jelentkezve
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('user/login')
  }
  next()
};


/*
 * Vizsgáljuk, hogy a profil oldal a sajátja-e
 */

exports.user = {
  hasAuthorization : function (req, res, next) {
      if (req.profile.id != req.user.id) {
        return res.redirect('/users/'+req.profile.id);
      }
      next()
    }
}


/*
 *  Vizsgáljuk, hogy az edzés a sajátja-e
 */

exports.workout = {
    hasAuthorization : function (req, res, next) {
      if (req.workout.user.id != req.user.id) {
        return res.redirect('/workouts/'+req.workout.id)
      }
      next()
    }
}
