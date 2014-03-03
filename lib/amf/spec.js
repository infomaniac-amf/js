module.exports = {
  /**
   * Markers represent a type AND its value
   */
  AMF3_UNDEFINED: 0x00,
  AMF3_NULL: 0x01,
  AMF3_FALSE: 0x02,
  AMF3_TRUE: 0x03,

  /**
   * Types represent their proceeding value
   */
  AMF3_INT: 0x04,
  AMF3_DOUBLE: 0x05,
  AMF3_STRING: 0x06,
  AMF3_XML_DOC: 0x07,    // not supported
  AMF3_DATE: 0x08,
  AMF3_ARRAY: 0x09,
  AMF3_OBJECT: 0x0A,
  AMF3_XML: 0x0B,    // not supported
  AMF3_BYTE_ARRAY: 0x0C,
  AMF3_VECTOR_INT: 0x0D,    // not supported
  AMF3_VECTOR_UINT: 0x0E,    // not supported
  AMF3_VECTOR_DOUBLE: 0x0F,    // not supported
  AMF3_VECTOR_OBJECT: 0x10,    // not supported
  AMF3_DICTIONARY: 0x11,    // not supported

  OBJECT_DYNAMIC: 0x00,

  REFERENCE_BIT: 0x01,

  MIN_2_BYTE_INT: 0x80,
  MIN_3_BYTE_INT: 0x4000,
  MIN_4_BYTE_INT: 0x200000,

  MAX_INT: 0xFFFFFFF,       // (2 ^ 28) - 1
  MIN_INT: -0x10000000,     // (-2 ^ 28)

  isLittleEndian: function() {
    return true;
  },

  /**
   * Determine if a given array is "dense".
   *
   * From the AMF spec:
   * "ordinal indices start at 0 and do not contain gaps between successive
   *  indices (that is, every index is defined from 0 for the length of the array)"
   *
   */
  isDenseArray: function(array) {
    if(!array) {
      return true;
    }

    var test = 0;
    for(var x in array) {

      if(x != test) {
        return false;
      }

      test++;
    }

    return true;
  },


};