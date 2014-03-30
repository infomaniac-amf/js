var indexOf = require('./indexof.js');

var ReferenceStore = function() {
  this.store = {};
  this.store[ReferenceStore.TYPE_STRING] = [];
  this.store[ReferenceStore.TYPE_OBJECT] = [];
};

/**
 * Creates or retrieves an object reference from the store
 *
 * @param data
 * @param type
 * @returns {*}
 */
var getReference = function(data, type) {
  var index = indexOf(this.store[type], data);
  if(index >= 0) {
    return index;
  }

  if(!this.validate(data)) {
    return false;
  }

  this.addReference(data, type);
  return false;
};

/**
 * Retrieves a value of a given type by reference
 *
 * @param reference
 * @param type
 * @returns {*}
 */
var getByReference = function(reference, type) {
  if(!this.store.hasOwnProperty(type)) {
    return false;
  }

  var count = this.store[type].length;

  if(reference >= count) {
    return false;
  }

  if(!count) {
    return false;
  }

  return this.store[type][reference];
};

/**
 * Validates a given value and type for issues
 * and prepares array for possible reference addition
 *
 * @param data
 * @returns {boolean}
 */
var validate = function(data) {
  // null or zero-length values cannot be assigned references
  if(data === null || (typeof data == 'string' && !data.length)) {
    return false;
  }

  return true;
};

/**
 * Adds a new reference by type
 *
 * @param data
 * @param type
 * @returns {*}
 */
var addReference = function(data, type) {
  if(!this.validate(data)) {
    return false;
  }

  this.store[type].push(data);
  return data;
};

ReferenceStore.prototype = {
  getReference: getReference,
  addReference: addReference,
  getByReference: getByReference,
  validate: validate
};

ReferenceStore.TYPE_STRING = 'string';
ReferenceStore.TYPE_OBJECT = 'object';

module.exports = ReferenceStore;