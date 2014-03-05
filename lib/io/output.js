var Stream = require('./stream.js'),
    Spec = require('../amf/spec.js'),
    float64 = require('../util/ieee754.js');

var OutputStream = function(raw) {
  // call super
  Stream.call(this, raw);
};

OutputStream.prototype = new Stream();
OutputStream.prototype.constructor = OutputStream;

/**
 * Write a single byte as a signed char
 */
OutputStream.prototype.writeByte = function(byte) {
  this.raw += String.fromCharCode(byte);
};

/**
 * Write a stream of bytes as signed chars
 */
OutputStream.prototype.writeDouble = function(double) {
  this.raw += toAscii(float64.pack(double, 11, 52));
};

/**
 * Write raw bytes
 */
OutputStream.prototype.writeRaw = function(raw) {
  this.raw += raw;
};

var toAscii = function(bytes) {
  var ascii = '';
  for(var i in bytes) {
    var byte = bytes[i];
    ascii += String.fromCharCode(parseInt(byte));
  }

  return ascii;
};

module.exports = OutputStream;