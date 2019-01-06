'use strict';

const assert = (value, message) => {
  if (!value) {
    throw new Error(message);
  }
};

const throws = (message) => {
  const err = new Error(message);
  throw err;
};

module.exports = {
  assert,
  throws,
};
