var Stream = require('./stream.js'),
	Spec = require('./../amf/spec.js'),
	pack = require('./../util/pack.js');

var OutputStream = function(raw) {
	// call super
	Stream.call(this, raw);
};

OutputStream.prototype = new Stream();
OutputStream.prototype.constructor = OutputStream;

/**
 * Write a single byte as a signed char
 */
OutputStream.prototype.writeByte = function(byte){
    this.writeBytes(byte);
}

/**
 * Write a stream of bytes as signed chars
 */
OutputStream.prototype.writeBytes = function(bytes) {
    this.raw += pack('c', bytes);
}

/**
 * Write raw bytes
 */
OutputStream.prototype.writeRaw = function(raw) {
    this.raw += raw;
}

module.exports = OutputStream;