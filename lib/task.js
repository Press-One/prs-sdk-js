'use strict';

const { request } = require('./request');
const utility = require('./utility');
const validator = require('./validator');

module.exports = Task;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Task(config) {
  this.config = config;
}

/**
 * 
 * @function create
 * @param {Object} task
 * @param {String} task.name
 * @param {String} task.description
 * @param {String} task.status
 * @param {String} task.budget
 * @param {String} task.award
 * @param {Number} task.numberOfParticipants
 * @param {String} task.startedAt
 * @param {String} task.endedAt
 * @param {Number} task.projectId
 * 
 * @returns {Promise}
 */
Task.prototype.create = function (task) {
  validator.assert(task, 'task cannot be null');
  validator.assert(task.name, 'task.name cannot be null');
  validator.assert(task.description, 'task.description cannot be null');
  validator.assert(task.status, 'task.status cannot be null');
  validator.assert(task.budget, 'task.budget cannot be null');
  validator.assert(task.award, 'task.award cannot be null'); 
  validator.assert(task.numberOfParticipants, 'task.numberOfParticipants cannot be null');
  validator.assert(task.startedAt, 'task.startedAt cannot be null');
  validator.assert(task.endedAt, 'task.endedAt cannot be null');

  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  let payload = {
    name: task.name,
    description: task.description,
    status: task.status,
    budget: task.budget,
    award: task.award,
    numberOfParticipants: task.numberOfParticipants,
    startedAt: task.startedAt,
    endedAt: task.endedAt,
  };
  if (task.projectId) {
    payload['projectId'] = task.projectId;
  }
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/tasks`,
    data: { payload },
    authOpts: authOpts,
    debug: this.config.debug
  });
}

/**
 * 
 * @function update
 * @param {Number} taskId
 * @param {Object} task
 * @param {String} task.name
 * @param {String} task.description
 * @param {String} task.status
 * @param {String} task.budget
 * @param {String} task.award
 * @param {Number} task.numberOfParticipants
 * @param {String} task.startedAt
 * @param {String} task.endedAt
 * @param {Number} task.projectId
 * 
 * @returns {Promise}
 */
Task.prototype.update = function (taskId, task) {
  validator.assert(task, 'task cannot be null');
  validator.assert(task.name, 'task.name cannot be null');
  validator.assert(task.description, 'task.description cannot be null');
  validator.assert(task.status, 'task.status cannot be null');
  validator.assert(task.budget, 'task.budget cannot be null');
  validator.assert(task.award, 'task.award cannot be null');
  validator.assert(task.numberOfParticipants, 'task.numberOfParticipants cannot be null');
  validator.assert(task.startedAt, 'task.startedAt cannot be null');
  validator.assert(task.endedAt, 'task.endedAt cannot be null');

  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  let payload = {
    name,
    description,
    status,
    budget,
    award,
    numberOfParticipants,
    startedAt,
    endedAt,
  };
  if (projectId) {
    payload['projectId'] = projectId;
  }
  return request({
    host: this.config.getHost(),
    method: 'put',
    path: `/tasks/${taskId}`,
    data: { payload },
    authOpts: authOpts,
    debug: this.config.debug
  });
}

/**
 * 
 * @function remove
 * @param {Number} taskId
 * 
 * @returns {Promise}
 */
Task.prototype.remove = function (taskId) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  return request({
    host: this.config.getHost(),
    method: 'delete',
    path: `/tasks/${taskId}`,
    authOpts: authOpts,
    debug: this.config.debug
  });
}

/**
 * 
 * @function getTasks
 * @param {number} projectId
 * 
 * @returns {Promise}
 */
Task.prototype.getTasks = function ({ projectId, filter, type, offset, limit}) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  validator.assert(projectId, 'projectId cannot be null');
  let query = { projectId };
  if (filter) {
    query['filter'] = filter;
  }
  if (type) {
    query['type'] = type;
  }
  if (offset) {
    query['offset'] = offset;
  }
  if (limit) {
    query['limit'] = limit;
  }

  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/tasks`,
    query: query,
    authOpts: authOpts,
    debug: this.config.debug
  });
}

/**
 * 
 * @function getSummary
 * @param {Number} projectId
 * @param {String} data.source
 * @param {String} data.originUrl
 * @param {String} data.category
 * 
 * @returns {Promise}
 */
Task.prototype.getSummary = function (projectId) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  validator.assert(projectId, 'projectId cannot be null');
  let query = { projectId };
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/tasks/summary`,
    query: query,
    authOpts: authOpts,
    debug: this.config.debug
  });
}

/**
 * 
 * @function getById
 * @param {Number} id
 * 
 * @returns {Promise}
 */
Task.prototype.getById = function (id) {
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  validator.assert(id, 'id cannot be null');
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/tasks/${taskId}`,
    authOpts: authOpts,
    debug: this.config.debug
  });
}