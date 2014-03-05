var BaseSerializer = require('./base.js'),
    Spec = require('./spec.js'),
    ReferenceStore = require('./../util/reference-store.js');

var Serializer = function(stream) {
  BaseSerializer.call(this, stream);
};

Serializer.prototype = new BaseSerializer();
Serializer.prototype.constructor = Serializer;

Serializer.prototype.serialize = function(data, includeType, forceType) {
  if(typeof includeType == 'undefined') includeType = true;

  var type = forceType ? forceType : this.getDataType(data);

  // add the AMF type marker for this data before the serialized data is added
  if(includeType) {
    this.stream.writeByte(type);
  }

  switch(type) {
    case Spec.AMF3_UNDEFINED:
    case Spec.AMF3_NULL:
    case Spec.AMF3_FALSE:
    case Spec.AMF3_TRUE:
      // no data is serialized except their type marker
      break;
    case Spec.AMF3_INT:
      this.serializeInt(data);
      break;
    case Spec.AMF3_DOUBLE:
      this.serializeDouble(data);
      break;
    case Spec.AMF3_STRING:
      this.serializeString(data);
      break;
    case Spec.AMF3_DATE:
      this.serializeDate(data);
      break;
    default:
      throw new Error('Unrecognized AMF type [' + type + ']');
      break;
  }

  return this.stream.getRaw();
};

Serializer.prototype.serializeInt = function(data) {
  if(data < Spec.MIN_INT || data > Spec.MAX_INT) {
    throw new Error('Integer out of range: ' + data);
  }

  if(data < 0 || data >= Spec.MIN_4_BYTE_INT) {
    this.stream.writeByte((data >> 22) | 0x80);
    this.stream.writeByte((data >> 15) | 0x80);
    this.stream.writeByte((data >> 8) | 0x80);
    this.stream.writeByte(data);
  } else if(data >= Spec.MIN_3_BYTE_INT) {
    this.stream.writeByte((data >> 14) | 0x80);
    this.stream.writeByte((data >> 7) | 0x80);
    this.stream.writeByte(data & 0x7f);
  } else if(data >= Spec.MIN_2_BYTE_INT) {
    this.stream.writeByte((data >> 7) | 0x80);
    this.stream.writeByte(data & 0x7f);
  } else {
    this.stream.writeByte(data);
  }
};

Serializer.prototype.serializeDouble = function(data) {
  this.stream.writeDouble(data);
};

Serializer.prototype.serializeString = function(data, useRefs) {
  useRefs = typeof useRefs == 'undefined' ? true : useRefs;

  if(useRefs) {
    var ref = this.referenceStore.getReference(data, ReferenceStore.TYPE_STRING);
    if(ref !== false) {
      //use reference
      this.serializeInt(ref << 1);
      return;
    }
  }

  this.serializeInt((data.length << 1) | 1);
  this.stream.writeRaw(data);
};

Serializer.prototype.serializeDate = function(data)
{
  var ref = this.referenceStore.getReference(data, ReferenceStore.TYPE_OBJECT);
  if (ref !== false) {
    //use reference
    this.serializeInt(ref << 1);
    return;
  }

  this.serialize(data.getTime(), true, Spec.AMF3_DOUBLE);
};

module.exports = Serializer;