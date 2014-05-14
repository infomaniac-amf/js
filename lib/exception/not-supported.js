var Exception = require('./base.js');

var NotSupportedException = function(message) {
  // call super
  Exception.call(this, message, 'NotSupportedException');
};

NotSupportedException.prototype = new Exception();
NotSupportedException.prototype.constructor = NotSupportedException;

module.exports = NotSupportedException;