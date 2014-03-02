var OutputStream = require('./../io/output.js'),
    InputStream = require('./../io/input.js'),
    Serializer = require('./../amf/serializer.js'),
    Deserializer = require('./../amf/deserializer.js');

var serialize = function(data) {
  var stream = new OutputStream();
  var serializer = new Serializer(stream);
  return serializer.serialize(data);
};

var deserialize = function(data) {
  var stream = new InputStream(data);
  var deserializer = new Deserializer(stream);
  return deserializer.deserialize();
};

module.exports = {
  serialize: serialize,
  deserialize: deserialize
};