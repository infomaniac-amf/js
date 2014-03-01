var Stream = require('./stream.js'),
	Spec = require('./../amf/spec.js'),
	unpack = require('./../util/unpack.js');

var InputStream = function(raw) {
	this.pointer = 0;

	// call super
	Stream.call(this, raw);
};

InputStream.prototype = new Stream();
InputStream.prototype.constructor = InputStream;

InputStream.prototype.readByte = function() {
    return this.readBytes(1);
}

InputStream.prototype.readRawByte = function() {
    return this.readBytes(1, true);
}

InputStream.prototype.readRawBytes = function(length) {
	if(typeof length == 'undefined') length = 1;
 	return this.readBytes(length, true);
}

InputStream.prototype.readBytes = function(length, raw)
{
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
}

/**
 * Read a byte as a float
 *
 * @return float
 */
InputStream.prototype.readDouble = function(){
    var double = this.readRawBytes(8);
    if (Spec.isLittleEndian()) {
        double = double.split("").reverse().join("");
    }

    double = unpack("d", double);
    return double[''];
}

module.exports = InputStream;