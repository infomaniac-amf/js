var test = require('tape');

var Spec = require('./lib/amf/spec.js'),
    AMF = require('./lib/amf/amf.js'),
    ByteArray = require('./lib/type/bytearray.js');

test('undefined', function(t) {
  t.plan(1);

  t.same(AMF.deserialize(AMF.serialize()), undefined);
});

test('null', function(t) {
  t.plan(1);

  t.same(AMF.deserialize(AMF.serialize(null)), null);
});

test('false', function(t) {
  t.plan(1);

  t.same(AMF.deserialize(AMF.serialize(false)), false);
});

test('true', function(t) {
  t.plan(1);

  t.same(AMF.deserialize(AMF.serialize(true)), true);
});

test('int', function(t) {

  var samples = [5, 100, -100, 100878, -199, Spec.MIN_INT, Spec.MAX_INT, -109876983];
  t.plan(samples.length + 1);

  for(var i in samples) {
    var sample = samples[i];

    var data = AMF.serialize(sample, true, Spec.AMF3_INT);
    t.same(AMF.deserialize(data), sample);
  }

  t.throws(function() {
    AMF.serialize(Spec.MAX_INT + 1, true, Spec.AMF3_INT);
  }, RangeError, 'should throw RangeError');

});

test('double', function(t) {

  var samples = [-10, 0.3767574, Spec.MIN_INT, Spec.MAX_INT, Math.PI, Number.MAX_VALUE, Number.MIN_VALUE, 102.145];
  t.plan(samples.length);

  for(var i in samples) {
    var sample = samples[i];
    t.same(AMF.deserialize(AMF.serialize(sample, true, Spec.AMF3_DOUBLE), Spec.AMF3_DOUBLE), sample);
  }
});

test('string', function(t) {

  var bigString = '';
  for(var i = 0; i < (Math.random() * 9999999) + 100000; i++) {
    bigString += String.fromCharCode(Math.round(Math.random() * 91) + 65);
  }

  var samples = ['hello!', '', '.', 'i ❤ π', bigString];
  t.plan(samples.length);

  for(var s in samples) {
    var sample = samples[s];
    t.same(AMF.deserialize(AMF.serialize(sample, true, Spec.AMF3_STRIG)), sample);
  }
});

test('date', function(t) {

  var samples = [new Date(), new Date(2011, 3, 9), new Date(1843, 1, 9), new Date(254, 1, 9), new Date(2040, 5, 12)];
  t.plan(samples.length);

  for(var i in samples) {
    var sample = samples[i];
    var data = AMF.deserialize(AMF.serialize(sample, true, Spec.AMF3_DATE));
    t.same(data, sample);
  }
});

test('array', function(t) {
  var sparse = [1, 2];
  sparse[5] = 9;

  var samples = [
    [1, 2, 3],
    [12.345, "hello", false, ['hi', 1234]],
    [true, false, null, "<h1>Hi</h1>"],
    sparse
  ];

  t.plan(samples.length);

  for(var i in samples) {
    var sample = samples[i];
    t.same(AMF.deserialize(AMF.serialize(sample, true, Spec.AMF3_ARRAY), Spec.AMF3_ARRAY), sample);
  }
});

test('object', function(t) {
  var ref = [1, 2, 3];

  var samples = [
    {"hello": "Bob!"},
    {
      "array": [99, 100, 101,
        {"nesting": "of objects", "yeah?": true, ref: ref}
      ],
      "reference": ref
    }
  ];

  t.plan(samples.length);

  for(var i in samples) {
    var sample = samples[i];
    var data = AMF.serialize(sample, true, Spec.AMF3_OBJECT);
    t.same(AMF.deserialize(data, Spec.AMF3_OBJECT), sample);
  }
});

test('bytearray', function(t) {

  t.plan(2);

  var simple = new ByteArray('656566');
  var data = AMF.deserialize(AMF.serialize(simple, true, Spec.AMF3_BYTE_ARRAY));
  t.same(data, simple);

  // create a bytearray with serialize AMF data, serialize the bytearray, deserialize the bytearray and then deserialize the AMF data
  // #meta

  var obj = {it: "works!"};
  var amf = new ByteArray(AMF.serialize(obj, true, Spec.AMF3_OBJECT));
  var serialized = AMF.serialize(amf, true, Spec.AMF3_BYTE_ARRAY);
  var deserialized = AMF.deserialize(serialized, Spec.AMF3_BYTE_ARRAY);

  t.same(AMF.deserialize(deserialized.getData(), Spec.AMF3_OBJECT), obj);

});