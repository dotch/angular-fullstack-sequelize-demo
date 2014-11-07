'use strict';
var should = require('should');
var app = require('../app');
var User = require('../models').User;

var user = User.build({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
});

describe('User Model', function() {
  before(function(done) {
    // Clear users before testing
    User.destroy().success(function() {
      done();
    });
  });
  afterEach(function(done) {
    User.destroy().then(function() {
      done();
    });
  });
  it('should begin with no users', function(done) {
    User.findAll().complete(function(err, users) {
      users.should.have.length(0);
      done();
    });
  });
  it('should fail when saving a duplicate user', function(done) {
    user.save().success(function() {
      var userDup = User.build(user);
      userDup.save().complete(function(err) {
        should.exist(err);
        done();
      });
    });
  });
  it('should fail when saving without an email', function(done) {
    user.email = '';
    user.save().complete(function(err) {
      console.log('aaaaargs', arguments);
      should.exist(err);
      done();
    });
  });
  it("should authenticate user if password is valid", function() {
    return user.authenticate('password').should.be.true;
  });
  it("should not authenticate user if password is invalid", function() {
    return user.authenticate('blah').should.not.be.true;
  });
});
