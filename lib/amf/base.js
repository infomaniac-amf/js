var Spec = require('./spec.js'),
    ByteArray = require('./../type/bytearray.js'),
    ReferenceStore = require('./../util/reference-store.js');

var BaseSerializer = function(stream) {
  this.stream = stream;
  this.referenceStore = new ReferenceStore();
};

BaseSerializer.prototype = {
  getDataType: function(data) {
    switch(true) {
      case typeof data == 'undefined':
        return Spec.AMF3_UNDEFINED;
        break;

      case data === null:
        return Spec.AMF3_NULL;
        break;

      case data === true || data === false:
        return data ? Spec.AMF3_TRUE : Spec.AMF3_FALSE;
        break;

      case typeof data == 'number' && data % 1 == 0:
        // AMF3 uses "Variable Length Unsigned 29-bit Integer Encoding"
        // ...depending on the size, we will either deserialize it as an integer or a float

        if(data < Spec.MIN_INT || data > Spec.MAX_INT) {
          return Spec.AMF3_DOUBLE;
        }

        return Spec.AMF3_INT;
        break;

      case typeof data == 'number' && data % 1 != 0:
        return Spec.AMF3_DOUBLE;
        break;

      case typeof data == 'string':
        return Spec.AMF3_STRING;
        break;

      case data instanceof Date:
        return Spec.AMF3_DATE;
        break;

      case data instanceof ByteArray:
        return Spec.AMF3_BYTE_ARRAY;
        break;

      case data instanceof Array:
        return Spec.AMF3_ARRAY;
        break;

      case typeof data == 'object':
        return Spec.AMF3_OBJECT;
        break;

      default:
        return null;
        break;
    }
  }
};

module.exports = BaseSerializer;