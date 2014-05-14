var BaseSerializer = require('./base.js'),
    Spec = require('./spec.js'),
    ReferenceStore = require('../util/reference-store.js'),
    ObjectUtil = require('../util/object.js'),
    ByteArray = require('../type/bytearray.js'),
    utf8 = require('utf8'),

    SerializationException = require('../exception/serialization.js');

var Serializer = function(stream, options) {
  this.options = options;

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

    case Spec.AMF3_ARRAY:
      this.serializeArray(data);
      break;

    case Spec.AMF3_OBJECT:
      this.serializeObject(data);
      break;

    case Spec.AMF3_BYTE_ARRAY:
      this.serializeByteArray(data);
      break;

    default:
      throw new SerializationException('Unrecognized AMF type [' + type + ']');
  }

  return this.stream.getRaw();
};

Serializer.prototype.serializeInt = function(data) {
  if(data < Spec.MIN_INT || data > Spec.MAX_INT) {
    throw new SerializationException('Integer out of range: ' + data);
  }

  data &= 0x1FFFFFFF;

  if (data < Spec.MIN_2_BYTE_INT) {
    this.stream.writeByte(data);
  } else if (data < Spec.MIN_3_BYTE_INT) {
    this.stream.writeByte(data >> 7 & 0x7F | 0x80);
    this.stream.writeByte(data & 0x7F);
  } else if (data < Spec.MIN_4_BYTE_INT) {
    this.stream.writeByte(data >> 14 & 0x7F | 0x80);
    this.stream.writeByte(data >> 7 & 0x7F | 0x80);
    this.stream.writeByte(data & 0x7F);
  } else {
    this.stream.writeByte(data >> 22 & 0x7F | 0x80);
    this.stream.writeByte(data >> 15 & 0x7F | 0x80);
    this.stream.writeByte(data >> 8 & 0x7F | 0x80);
    this.stream.writeByte(data & 0xFF);
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

  var encoded = utf8.encode(data);
  this.serializeInt((encoded.length << 1) | 1);
  this.stream.writeRaw(encoded);
};

Serializer.prototype.serializeDate = function(data) {
  var ref = this.referenceStore.getReference(data, ReferenceStore.TYPE_OBJECT);
  if(ref !== false) {
    //use reference
    this.serializeInt(ref << 1);
    return;
  }

  this.serialize(data.getTime(), true, Spec.AMF3_DOUBLE);
};

Serializer.prototype.serializeArray = function(data) {
  var ref = this.referenceStore.getReference(data, ReferenceStore.TYPE_OBJECT);
  if(ref !== false) {
    //use reference
    this.serializeInt(ref << 1);
    return;
  }

  var element = null;
  var isDense = Spec.isDenseArray(data);
  if(isDense) {
    this.serializeInt((data.length << 1) | Spec.REFERENCE_BIT);
    this.serializeString('');

    for(var i in data) {
      element = data[i];
      this.serialize(element);
    }

  } else {
    this.serializeInt(1);

    for(var key in data) {
      element = data[key];
      this.serializeString(key, false);
      this.serialize(element);
    }

    this.serializeString('');
  }
};

Serializer.prototype.serializeObject = function(data) {

  var ref = this.referenceStore.getReference(data, ReferenceStore.TYPE_OBJECT);
  if(ref !== false) {
    //use reference
    this.serializeInt(ref << 1);
    return;
  }

  // maintain a reference to the initial object
  var object = data;

  // if object is serializable, export its data first
  if(ObjectUtil.isSerializable(data)) {
    data = data.exportData();
  }

  var properties = ObjectUtil.getObjectKeys(data);

  // write object info & class name
  this.serializeInt(11);
  this.serializeString(ObjectUtil.getClassName(object, this.options), false);

  // write keys
  if(properties.length > 0) {
    for(var i in properties) {
      var key = properties[i];
      var value = data[key];
      this.serializeString(key, false);
      this.serialize(value);
    }
  }

  // close
  this.serializeString('');
};

Serializer.prototype.serializeByteArray = function(data) {
  if(!('getData' in data)) {
    throw new SerializationException('Invalid ByteArray data provided');
  }

  var ref = this.referenceStore.getReference(data, ReferenceStore.TYPE_OBJECT);
  if(ref !== false) {
    //use reference
    this.serializeInt(ref << 1);
    return;
  }

  // write length
  this.serializeInt((data.getData().length << 1) | Spec.REFERENCE_BIT);

  // write raw bytes
  this.stream.writeRaw(data.getData());
};

module.exports = Serializer;
