var Exception = require('./base.js');

var SerializationException = function(message) {
  // call super
  Exception.call(this, message, 'SerializationException');
};

SerializationException.prototype = new Exception();
SerializationException.prototype.constructor = SerializationException;

module.exports = SerializationException;