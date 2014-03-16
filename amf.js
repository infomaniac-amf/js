var AMF = require('./lib/amf/amf.js');

window.AMF = {
  parse: AMF.deserialize,
  stringify: AMF.serialize
};