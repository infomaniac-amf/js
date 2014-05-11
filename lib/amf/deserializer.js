var AMF = require('./amf.js'),
    BaseSerializer = require('./base.js'),
    Spec = require('./spec.js'),
    ReferenceStore = require('../util/reference-store.js'),
    ByteArray = require('../type/bytearray.js'),
    utf8 = require('utf8'),
    exception = require('./exception.js');

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

    case Spec.AMF3_NULL:
      return null;

    case Spec.AMF3_FALSE:
      return false;

    case Spec.AMF3_TRUE:
      return true;

    case Spec.AMF3_INT:
      return this.deserializeInt();

    case Spec.AMF3_DOUBLE:
      return this.deserializeDouble();

    case Spec.AMF3_STRING:
      return this.deserializeString();

    case Spec.AMF3_DATE:
      return this.deserializeDate();

    case Spec.AMF3_ARRAY:
      return this.deserializeArray();

    case Spec.AMF3_OBJECT:
      return this.deserializeObject();

    case Spec.AMF3_BYTE_ARRAY:
      return this.deserializeByteArray();

    default:
      throw new exception.DeserializationException('Cannot deserialize type: ' + type);
  }
};

Deserializer.prototype.deserializeInt = function() {
  var result = 0;

  var n = 0;
  var b = this.stream.readByte();
  while((b & 0x80) !== 0 && n < 3) {
    result <<= 7;
    result |= (b & 0x7F);
    b = this.stream.readByte();
    n++;
  }
  if(n < 3) {
    result <<= 7;
    result |= b;
  } else {
    result <<= 8;
    result |= b;
    if((result & 0x10000000) !== 0) {
      result |= 0xE0000000;
    }
  }

  return result;
};

Deserializer.prototype.deserializeDouble = function() {
  return this.stream.readDouble();
};

Deserializer.prototype.deserializeString = function() {
  var reference = this.deserializeInt();

  if((reference & Spec.REFERENCE_BIT) === 0) {
    reference >>= Spec.REFERENCE_BIT;

    return this.referenceStore.getByReference(reference, ReferenceStore.TYPE_STRING);
  }

  var length = reference >> Spec.REFERENCE_BIT;
  var string = utf8.decode(this.stream.readRawBytes(length));
  this.referenceStore.addReference(string, ReferenceStore.TYPE_STRING);

  return string;
};

Deserializer.prototype.deserializeDate = function() {
  var reference = this.deserializeInt();

  if((reference & Spec.REFERENCE_BIT) === 0) {
    reference >>= Spec.REFERENCE_BIT;

    return this.referenceStore.getByReference(reference, ReferenceStore.TYPE_OBJECT);
  }

  var millisSinceEpoch = this.stream.readDouble();
  var date = new Date(millisSinceEpoch);

  this.referenceStore.addReference(date, ReferenceStore.TYPE_OBJECT);

  return date;
};

Deserializer.prototype.deserializeArray = function() {
  var reference = this.deserializeInt();

  if((reference & Spec.REFERENCE_BIT) === 0) {
    reference >>= Spec.REFERENCE_BIT;

    return this.referenceStore.getByReference(reference, ReferenceStore.TYPE_OBJECT);
  }

  var size = reference >> Spec.REFERENCE_BIT;

  var arr = [];
  this.referenceStore.addReference(arr, ReferenceStore.TYPE_OBJECT);

  var key = this.deserializeString();
  while(key.length > 0) {
    arr[key] = this.deserialize();
    key = this.deserializeString();
  }

  for(var i = 0; i < size; i++) {
    arr.push(this.deserialize());
  }

  return arr;
};

Deserializer.prototype.deserializeObject = function() {
  var reference = this.deserializeInt();

  if((reference & Spec.REFERENCE_BIT) === 0) {
    reference >>= Spec.REFERENCE_BIT;

    return this.referenceStore.getByReference(reference, ReferenceStore.TYPE_OBJECT);
  }

  var classAlias = this.deserializeString();

  // need some kinda of callback function here to mix in the class' prototype to provide serializable functionality
  var instance = {};

  // add a new reference at this stage - essential to handle self-referencing objects
  this.referenceStore.addReference(instance, ReferenceStore.TYPE_OBJECT);

  // collect all properties into hash
  var data = {};
  var property = this.deserializeString();

  while(property.length) {
    data[property] = this.deserialize();
    property = this.deserializeString();
  }

  // any custom classname will hint as serializability
  if(classAlias && classAlias.length > 0) {
    var classType = AMF.getClassByAlias(classAlias);

    if(!classType) {
      throw new exception.DeserializationException('Class ' + classAlias + ' cannot be found. Consider registering a class alias.');
    }

    instance = new classType;
    if('importData' in instance && typeof instance.importData == 'function') {
      instance.importData(data);
    } else {
      applyDataToInstance(instance, data);
    }
  } else {
    // assign all properties to class if property is public
    applyDataToInstance(instance, data);
  }

  return instance;
};

var applyDataToInstance = function(instance, data) {
  try {
    for(var key in data) {
      var val = data[key];
      instance[key] = val;
    }
  } catch(e) {
    throw new exception.DeserializationException("Property '" + key + "' cannot be set on instance '" + (typeof instance) + "'");
  }
};

Deserializer.prototype.deserializeByteArray = function() {
  var reference = this.deserializeInt();

  if((reference & Spec.REFERENCE_BIT) === 0) {
    reference >>= Spec.REFERENCE_BIT;

    return this.referenceStore.getByReference(reference, ReferenceStore.TYPE_OBJECT);
  }

  var length = reference >> Spec.REFERENCE_BIT;
  var bytes = this.stream.readRawBytes(length);

  return new ByteArray(bytes);

};

module.exports = Deserializer;
