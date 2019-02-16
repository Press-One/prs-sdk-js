'use strict';

// const request = require('superagent');
const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');
const User = require('./user');
const Account = require('./account');
const Config = require('./config');
const Subscription = require('./subscription');
const Finance = require('./finance');
const File = require('./file');
const Block = require('./block');
const Draft = require('./draft');
const Contract = require('./contract');


let config = new Config();

module.exports.setEnv = (env) => {
  config.env = env;
};

module.exports.setDebug = (debug) => {
  config.debug = debug;
};

module.exports.utility = utility;
module.exports.Account = new Account(config);
module.exports.User = new User(config);
module.exports.Subscription = new Subscription(config);
module.exports.Finance = new Finance(config);
module.exports.File = new File(config);
module.exports.Block = new Block(config);
module.exports.Draft = new Draft(config);
module.exports.Contract = new Contract(config);