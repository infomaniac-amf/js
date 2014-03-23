var CLASS_MAPPING = 0x01;
var DEFAULT_OPTIONS = 0x00;
var CLASS_MAPPING_FIELD = '_classMapping';

module.exports = {
  serialize: serialize,
  deserialize: deserialize,

  parse: parse,
  stringify: stringify,

  registerClassAlias: registerClassAlias,
  getClassByAlias: getClassByAlias,

  CLASS_MAPPING: CLASS_MAPPING,
  DEFAULT_OPTIONS: DEFAULT_OPTIONS,

  CLASS_MAPPING_FIELD: CLASS_MAPPING_FIELD
};

var OutputStream = require('../io/output.js'),
    InputStream = require('../io/input.js'),
    Serializer = require('../amf/serializer.js'),
    Deserializer = require('../amf/deserializer.js');

var classMappings = {};

/**
 * Serializes an object into an AMF packet
 *
 * @param data
 * @param includeType
 * @param forceType
 * @param options
 * @returns {*}
 */
function serialize(data, includeType, forceType, options) {
  options = typeof options == 'undefined' ? DEFAULT_OPTIONS : options;

  var stream = new OutputStream();
  var serializer = new Serializer(stream, options);
  return serializer.serialize(data, includeType, forceType);
}

/**
 * Deserializes an AMF packet
 *
 * @param data
 * @param forceType
 * @returns {*}
 */
function deserialize(data, forceType) {
  var stream = new InputStream(data);
  var deserializer = new Deserializer(stream);
  return deserializer.deserialize(forceType);
}

/**
 * Deserializes an AMF packet
 * Convenience method to match JSON API
 *
 * @param data
 * @returns {}
 */
function parse(data) {
  return deserialize(data);
}

/**
 * Serializes an object into an AMF packet
 * Convenience method to match JSON API
 *
 * @param data
 * @param options
 * @returns {}
 */
function stringify(data, options) {
  return serialize(data, true, undefined, options);
}

/**
 * Register a class alias for a particular name
 *
 * @param alias
 * @param obj
 */
function registerClassAlias(alias, obj) {
  classMappings[alias] = obj;
}

/**
 * Return a class based on its related alias
 *
 * @param alias
 * @returns {*}
 */
function getClassByAlias(alias) {
  if(!(alias in classMappings)) {
    return null;
  }

  return classMappings[alias];
}