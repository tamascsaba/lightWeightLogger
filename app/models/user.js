
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
   Schema = mongoose.Schema,
  crypto = require('crypto'),
  _ = require('underscore'),
  authTypes = ['twitter', 'facebook', 'google']

/**
 * User Schema
 */
module.exports = function (io) {

}

var UserSchema = new Schema({
  name: String,
  email: String,
  username: String,
  provider: String,
  hashed_password: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {}
})

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })

/**
 * Validaació
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

UserSchema.path('name').validate(function (name) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return name.length;
}, 'Nem adtad meg a neved!');

UserSchema.path('email').validate(function (email) {

  if (authTypes.indexOf(this.provider) !== -1) return true;
  return email.length;
}, 'Nem adtad meg az e-mail címed!');

UserSchema.path('username').validate(function (username) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return username.length;
}, 'Felhasználóneved nem lehet üres!');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return hashed_password.length;
}, 'Jelszavad nem lehet üres');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password)
    && authTypes.indexOf(this.provider) === -1)
    next(new Error('Rossz jelszót adtál meg!'));
  else
    next();
})

/**
 * Metódusok
 */

UserSchema.methods = {

  /**
   * Azonósítás - megadott jelszó egyezik-e a hash-tel.
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function(password) {
    if (!password) return '';
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  }
}

mongoose.model('User', UserSchema);