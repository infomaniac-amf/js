var OutputStream = require('../io/output.js'),
    InputStream = require('../io/input.js'),
    Serializer = require('../amf/serializer.js'),
    Deserializer = require('../amf/deserializer.js');

var serialize = function(data, includeType, forceType) {
  var stream = new OutputStream();
  var serializer = new Serializer(stream);
  return serializer.serialize(data, includeType, forceType);
};

var deserialize = function(data, forceType) {
  var stream = new InputStream(data);
  var deserializer = new Deserializer(stream);
  return deserializer.deserialize(forceType);
};

module.exports = {
  serialize: serialize,
  deserialize: deserialize
};