'use strict';

const utility = require('./utility');

const User = require('./user');
const Keystore = require('./keystore');
const Config = require('./config');
const Subscription = require('./subscription');
const Finance = require('./finance');
const File = require('./file');
const Block = require('./block');
const Draft = require('./draft');
const Contract = require('./contract');
const DApp = require('./dapp');


module.exports = PRS;

/**
 * 
 * constructor
 * @param {Object} options
 * @param {string} options.env
 * @param {boolean} options.debug
 * @param {string} options.privateKey
 * @param {string} options.token
 * @param {string} options.address
 */
function PRS(options) {
  this.config = new Config(options);

  this.keystore = new Keystore(this.config);
  this.user = new User(this.config);
  this.subscription = new Subscription(this.config);
  this.finance = new Finance(this.config);
  this.file = new File(this.config);
  this.block = new Block(this.config);
  this.draft = new Draft(this.config);
  this.contract = new Contract(this.config);
  this.dapp = new DApp(this.config);
}

module.exports.utility = utility;