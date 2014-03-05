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

var getClassName = function(obj) {
  if(typeof(obj) === 'object' && obj.hasOwnProperty('_classMapping')) {
    return obj._classMapping;
  }

  return '';
};

var getObjectKeys = function(data) {
  if(!data) {
    return [];
  }

  var keys = [];
  for(var key in data) {
    keys.push(key);
  }

  return keys;
};

module.exports = {
  isSerializable: isSerializable,
  getClassName: getClassName,
  getObjectKeys: getObjectKeys
};