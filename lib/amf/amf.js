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
var serialize = function(data, includeType, forceType, options) {
  options = typeof options == 'undefined' ? AMF_DEFAULT_OPTIONS : options;

  var stream = new OutputStream();
  var serializer = new Serializer(stream, options);
  return serializer.serialize(data, includeType, forceType);
};

/**
 * Deserializes an AMF packet
 *
 * @param data
 * @param forceType
 * @returns {*}
 */
var deserialize = function(data, forceType) {
  var stream = new InputStream(data);
  var deserializer = new Deserializer(stream);
  return deserializer.deserialize(forceType);
};

/**
 * Deserializes an AMF packet
 * Convenience method to match JSON API
 *
 * @param data
 * @returns {}
 */
var parse = function(data) {
  return deserialize(data);
};

/**
 * Serializes an object into an AMF packet
 * Convenience method to match JSON API
 *
 * @param data
 * @param options
 * @returns {}
 */
var stringify = function(data, options) {
  return serialize(data, true, undefined, options);
};

/**
 *
 * @param alias
 * @param obj
 */
var registerClassAlias = function(alias, obj) {
  classMappings[alias] = obj;
};

var getClassByAlias = function(alias) {
  if(!(alias in classMappings)) {
    return null;
  }

  return classMappings[alias];
};

module.exports = {
  serialize: serialize,
  deserialize: deserialize,

  parse: parse,
  stringify: stringify,

  registerClassAlias: registerClassAlias,
  getClassByAlias: getClassByAlias
};