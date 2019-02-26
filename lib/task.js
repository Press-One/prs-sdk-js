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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Task.prototype.create = function (task, authOpts) {
  validator.assert(task, 'task cannot be null');
  validator.assert(task.name, 'task.name cannot be null');
  validator.assert(task.description, 'task.description cannot be null');
  validator.assert(task.status, 'task.status cannot be null');
  validator.assert(task.budget, 'task.budget cannot be null');
  validator.assert(task.award, 'task.award cannot be null'); 
  validator.assert(task.numberOfParticipants, 'task.numberOfParticipants cannot be null');
  validator.assert(task.startedAt, 'task.startedAt cannot be null');
  validator.assert(task.endedAt, 'task.endedAt cannot be null');

  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Task.prototype.update = function (taskId, task, authOpts) {
  validator.assert(task, 'task cannot be null');
  validator.assert(task.name, 'task.name cannot be null');
  validator.assert(task.description, 'task.description cannot be null');
  validator.assert(task.status, 'task.status cannot be null');
  validator.assert(task.budget, 'task.budget cannot be null');
  validator.assert(task.award, 'task.award cannot be null');
  validator.assert(task.numberOfParticipants, 'task.numberOfParticipants cannot be null');
  validator.assert(task.startedAt, 'task.startedAt cannot be null');
  validator.assert(task.endedAt, 'task.endedAt cannot be null');

  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');

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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Task.prototype.remove = function (taskId, authOpts) {
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');
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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Task.prototype.getTasks = function ({ projectId, filter, type, offset, limit}, authOpts) {
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');
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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Task.prototype.getSummary = function (projectId, authOpts) {
  validator.assert(authOpts, 'authOpts cannot be null');
  validator.assert(authOpts.privateKey || authOpts.token, 'authOpts.privateKey or authOpts.token cannot be null');
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
 * @param {Object} authOpts
 * @param {String} authOpts.privateKey
 * @param {String} authOpts.token
 * 
 * @returns {Promise}
 */
Task.prototype.getById = function (id, authOpts) {

  validator.assert(id, 'id cannot be null');
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/tasks/${taskId}`,
    authOpts: authOpts,
    debug: this.config.debug
  });
}