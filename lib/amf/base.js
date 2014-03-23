var Spec = require('./spec.js'),
    ByteArray = require('../type/bytearray.js'),
    ReferenceStore = require('../util/reference-store.js');

var BaseSerializer = function(stream) {
  this.stream = stream;
  this.referenceStore = new ReferenceStore();
};

BaseSerializer.prototype = {
  getDataType: function(data) {
    switch(true) {
      case typeof data == 'undefined':
        return Spec.AMF3_UNDEFINED;

      case data === null:
        return Spec.AMF3_NULL;

      case data === true || data === false:
        return data ? Spec.AMF3_TRUE : Spec.AMF3_FALSE;

      case typeof data == 'number' && data % 1 === 0:
        // AMF3 uses "Variable Length Unsigned 29-bit Integer Encoding"
        // ...depending on the size, we will either deserialize it as an integer or a float

        if(data < Spec.MIN_INT || data > Spec.MAX_INT) {
          return Spec.AMF3_DOUBLE;
        }

        return Spec.AMF3_INT;

      case typeof data == 'number' && data % 1 !== 0:
        return Spec.AMF3_DOUBLE;

      case typeof data == 'string':
        return Spec.AMF3_STRING;

      case data instanceof Date:
        return Spec.AMF3_DATE;

      case data instanceof ByteArray:
        return Spec.AMF3_BYTE_ARRAY;

      case data instanceof Array:
        return Spec.AMF3_ARRAY;

      case typeof data == 'object':
        return Spec.AMF3_OBJECT;

      case typeof data == 'function':
        throw new Error('Cannot serialize a function');

      default:
        return null;
    }
  }
};

module.exports = BaseSerializer;