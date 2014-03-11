var amf = require('./lib/amf/amf.js'),
    Spec = require('./lib/amf/spec.js'),
    utf8 = require('utf8');

window.AMF = amf;
window.Spec = Spec;
window.utf8 = utf8;

String.prototype.toByteArray = function() {
  var bytes = [];

  var s = unescape(encodeURIComponent(this));

  for(var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    bytes.push(c);
  }

  return bytes;
};

/*
 * Returns the number of bytes in the given UTF-8 string.
 */
String.prototype.fromUTF8String = function() {
  if(!this || !this.hasOwnProperty('length')) {
    return '';
  }

  for(var i = 0; i < this.length; i++) {
    var c = String.fromCharCode(this[i]);
    console.log(c);
//    bytes.push(c);
  }

  return '';
};