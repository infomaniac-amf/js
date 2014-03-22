var isSerializable = function(obj) {
  if(!obj) {
    return false;
  }

  // must have a property "serializable" set to true, and both export() and import() methods
//  return typeof(obj.serializable) === 'boolean' &&
//      (typeof(obj.export) === 'function' && typeof(obj.import) === 'function') &&
//      obj.serializable === true;

  return false;
};

var getClassName = function(obj, options) {
  if(typeof obj === 'object' && (AMF_CLASS_MAPPING_FIELD in obj)) {
    return (options & AMF_CLASS_MAPPING) ? obj._classMapping : '';
  }

  return '';
};

var getObjectKeys = function(data) {
  if(!data) {
    return [];
  }

  var keys = [];
  for(var key in data) {
    if(key == AMF_CLASS_MAPPING_FIELD) {
      continue;
    }

    keys.push(key);
  }

  return keys;
};

module.exports = {
  isSerializable: isSerializable,
  getClassName: getClassName,
  getObjectKeys: getObjectKeys
};