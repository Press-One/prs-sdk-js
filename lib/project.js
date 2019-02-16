'use strict';

const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');

module.exports = Project;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Project(config) {
  this.config = config;
}