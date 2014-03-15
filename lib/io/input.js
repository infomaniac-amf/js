var Stream = require('./stream.js'),
    Spec = require('../amf/spec.js'),
    float64 = require('../util/ieee754.js');

var InputStream = function(raw) {
  this.pointer = 0;

  // call super
  Stream.call(this, raw);
};

InputStream.prototype = new Stream();
InputStream.prototype.constructor = InputStream;

InputStream.prototype.readByte = function() {
  return this.readBytes(1);
};

InputStream.prototype.readRawByte = function() {
  return this.readBytes(1, true);
};

InputStream.prototype.readRawBytes = function(length) {
  if(typeof length == 'undefined') length = 1;
  return this.readBytes(length, true);
};

InputStream.prototype.readBytes = function(length, raw) {
  if(typeof length == 'undefined') length = 1;
  if(typeof raw == 'undefined') raw = false;

  value = this.getRaw().substr(this.pointer, length);
  this.pointer += value.length;

  if(raw) {
    return value;
  }

  var ordinal = '';
  for(var i = 0; i < value.length; i++) {
    ordinal += value.charCodeAt(i);
  }

  return ordinal;
};

/**
 * Read a byte as a float
 *
 * @return float
 */
InputStream.prototype.readDouble = function() {
  var double = this.readRawBytes(8);
  return float64.unpack(fromAscii(double));
};

var fromAscii = function(data) {
  var bytes = [];
  var reversed = data.split('');
  for(var i in reversed) {
    bytes.push(reversed[i].toString().charCodeAt(0));
  }

  return bytes;
};

module.exports = InputStream;