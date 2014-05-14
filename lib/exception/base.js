var Exception = function(message, name) {
  this.message = message;
  this.name = name;
};

Exception.prototype = new Error();
Exception.prototype.constructor = Exception;

module.exports = Exception;