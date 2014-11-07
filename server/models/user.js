'use strict';

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name:     { type: DataTypes.STRING },
    email:    { type: DataTypes.STRING, unique: true, allowNull: false,
      set: function(email)  {
        this.setDataValue('email', email.toLowerCase());
      }
    },
    role:     { type: DataTypes.STRING, defaultValue: 'user' },
    password: { type: DataTypes.STRING, allowNull: false,
      set: function(password) {
        this.salt = this.makeSalt();
        this.setDataValue('password', this.encryptPassword(password));
      }
    },
    provider: { type: DataTypes.STRING },
    salt:     { type: DataTypes.STRING }
  }, {
    instanceMethods: {
      /**
       * Authenticate - check if the passwords are the same
       *
       * @param {String} plainText
       *        {function} callBack
       * @api public
       */
      authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.password;
      },
      /**
       * Make salt
       *
       * @return {String}
       * @api public
       */
      makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
      },
      /**
       * Encrypt password
       *
       * @param {String} password
       * @return {String}
       * @api public
       */
      encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
      },
      // Non-sensitive info we'll be putting in the token
      getToken: function() {
        return {
          id: this.id,
          role: this.role
        }
      },
      // Public profile information
      getProfile: function() {
        return {
          name: this.name,
          role: this.role
        }
      }
    }
  });
  return User;
}
