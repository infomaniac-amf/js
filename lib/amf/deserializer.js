var BaseSerializer = require('./base.js'),
    Spec = require('./spec.js'),
    float64 = require('./../util/ieee754.js');

var Deserializer = function(stream) {
  BaseSerializer.call(this, stream);
};

Deserializer.prototype = new BaseSerializer();
Deserializer.prototype.constructor = Deserializer;
Deserializer.prototype.deserialize = function(data) {
  var type = this.stream.readByte(data);

  switch(parseInt(type)) {
    case Spec.AMF3_UNDEFINED:
      return undefined;
      break;
    case Spec.AMF3_NULL:
      return null;
      break;
    case Spec.AMF3_FALSE:
      return false;
      break;
    case Spec.AMF3_TRUE:
      return true;
      break;
    case Spec.AMF3_INT:
      return this.deserializeInt();
      break;
    case Spec.AMF3_DOUBLE:
      return this.deserializeDouble();
      break;
    default:
      throw new Error('Cannot deserialize type: ' + type);
      break;
  }
};

Deserializer.prototype.deserializeInt = function() {
  var result = 0;

  var n = 0;
  var b = this.stream.readByte();
  while ((b & 0x80) != 0 && n < 3) {
    result <<= 7;
    result |= (b & 0x7F);
    b = this.stream.readByte();
    n++;
  }
  if (n < 3) {
    result <<= 7;
    result |= b;
  } else {
    result <<= 8;
    result |= b;
    if ((result & 0x10000000) != 0) {
      result |= Spec.MIN_INT;
    }
  }

  return result;
};

Deserializer.prototype.deserializeDouble = function() {
  return this.stream.readDouble();
};

module.exports = Deserializer;