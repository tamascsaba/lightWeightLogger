
/**
 * Module függőségek.
 */

var mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    Schema = mongoose.Schema;



/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',');
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',');
}

/**
 * Workout Schema
 */

var WorkoutSchema = new Schema({
  title: {type : String, default : '', trim : true},
  time: {type : Number, default : 60, trim : true},
  body: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }],
  tags: {type: [], get: getTags, set: setTags},
  createdAt  : {type : Date, default : Date.now}
});

/**
 * Validáció
 */

WorkoutSchema.path('title').validate(function (title) {
  return title.length > 0;
}, 'Az edzés neve nem lehet üres!');

WorkoutSchema.path('body').validate(function (body) {
  return body.length > 0;
}, 'Az edzés leírása nem lehet üres!');

/**
 * Metódusok
 */

module.exports = function (io) {

  WorkoutSchema.methods = {

    /**
     * Edzés mentése és a képek feltöltése
     *
     * @param {Object} user
     * @param {Function} cb
     * @api public
     */

    uploadAndSave: function (user, cb) {
      var self = this;

      //Edzés mentése & Socket.io futtatása Yepp :)
      self.save(function(err){
        if(!err) {
          //Get the username to self
          if (err) return console.log(err);
          if (!user) return next(new Error('Nem sikerült betölteni a felhasználót id: ' + id));
            
          // Minden OK
          var ioTemplate = '<h3>' + self.user + '</h3>';
          io.sockets.emit('workout', ioTemplate);
        }
        cb(err);
      });
      
    }

  }

  /**
   * Statics
   */

  WorkoutSchema.statics = {

    /**
     * Edzés keresése id alapján
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api public
     */

    load: function (id, cb) {
      this.findOne({ _id : id })
        .populate('user', 'name')
        .populate('comments.user')
        .exec(cb);
    },

    /**
     * Edzések listázása
     *
     * @param {Object} beállítások
     * @param {Function} cb
     * @api public
     */

    list: function (options, cb) {
      var criteria = options.criteria || {};

      this.find(criteria)
        .populate('user', 'name')
        .sort({'createdAt': -1}) // dátum szeriten rendezés
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec(cb);
    }

  }

mongoose.model('Workout', WorkoutSchema);
}


