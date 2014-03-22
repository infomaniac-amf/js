var AMF = require('./lib/amf/amf.js'),
    Spec = require('./lib/amf/spec.js'),
    ByteArray = require('./lib/type/bytearray.js');

window.AMF_CLASS_MAPPING = 0x01;
window.AMF_DEFAULT_OPTIONS = 0x00;

window.AMF_CLASS_MAPPING_FIELD = '_classMapping';

window.AMF = AMF;
window.Spec = Spec;
window.ByteArray = ByteArray;