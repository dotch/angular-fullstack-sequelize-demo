'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  dbUrl: 'postgres://' + process.env.USER + ':@localhost:5432/pimp',
  seedDB: true
};
