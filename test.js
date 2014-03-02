var test = require('tape');

var pack = require('./lib/util/pack.js');
var unpack = require('./lib/util/unpack.js');
var Spec = require('./lib/amf/spec.js');
var Stream = require('./lib/io/stream.js');
var InputStream = require('./lib/io/input.js');
var OutputStream = require('./lib/io/output.js');
var AMF = require('./lib/amf/amf.js');
var util = require('util');
var BinaryParser = require('./lib/util/binary-parser.js');

test('binary parser lib', function(t) {
  var b = new BinaryParser(!Spec.isLittleEndian(), true);

  t.plan(1);
  t.equal(98.75, b.toDouble(b.fromDouble(98.75)));
});

return;

test('undefined', function(t) {
  t.plan(1);

  t.equal(undefined, AMF.deserialize(AMF.serialize()));
});

test('null', function(t) {
  t.plan(1);

  t.equal(null, AMF.deserialize(AMF.serialize(null)));
});

test('false', function(t) {
  t.plan(1);

  t.equal(false, AMF.deserialize(AMF.serialize(false)));
});

test('true', function(t) {
  t.plan(1);

  t.equal(true, AMF.deserialize(AMF.serialize(true)));
});

test('int', function(t) {
  t.plan(1);

  t.equal(100, AMF.deserialize(AMF.serialize(100)));
});

test('double', function(t) {
  t.plan(1);

  t.equal(102.145, AMF.deserialize(AMF.serialize(102.145)));
});