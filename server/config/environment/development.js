'use strict';

// Development specific configuration
// ==================================
module.exports = {
  dbUrl: 'postgres://' + process.env.USER + ':@localhost:5432/pimp',
  seedDB: true
};
