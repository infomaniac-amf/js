var AMF = require('./../amf/amf.js');

var isSerializable = function(obj) {
  if(!obj) {
    return false;
  }

  return 'exportData' in obj && 'importData' in obj;
};

var getClassName = function(obj, options) {
  if(typeof obj === 'object' && (AMF.CLASS_MAPPING_FIELD in obj)) {
    return (options & AMF.CLASS_MAPPING) ? obj._classMapping : '';
  }

  return '';
};

var getObjectKeys = function(data) {
  if(!data) {
    return [];
  }

  var keys = [];
  for(var key in data) {
    if(key == AMF.CLASS_MAPPING_FIELD) {
      continue;
    }

    if(typeof data[key] == 'function') {
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