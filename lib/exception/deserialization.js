var Exception = require('./base.js');

var DeserializationException = function(message) {
  // call super
  Exception.call(this, message, 'DeserializationException');
};

DeserializationException.prototype = new Exception();
DeserializationException.prototype.constructor = DeserializationException;

module.exports = DeserializationException;