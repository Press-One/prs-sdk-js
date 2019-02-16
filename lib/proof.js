'use strict';

const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');

module.exports = Proof;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Proof(config) {
  this.config = config;
}
