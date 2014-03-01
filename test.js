var test = require('tape');

var pack = require('./lib/util/pack.js');
var unpack = require('./lib/util/unpack.js');
var Spec = require('./lib/amf/spec.js');
var Stream = require('./lib/io/stream.js');
var InputStream = require('./lib/io/input.js');
var OutputStream = require('./lib/io/output.js');
var AMF = require('./lib/amf/amf.js');

// var os = new OutputStream("ABC");
// var s = new InputStream(os.getRaw());
// console.log(s.readBytes(3));

test('undefined', function(t) {
  t.plan(1);

  t.equal(Spec.AMF3_UNDEFINED, AMF.deserialize(AMF.serialize()));
});

// console.log(s.readDouble() == Number.MAX_VALUE);

  return;

test('int roundtrip', function (t) {
  var pointer = 0;
  var startVal = Math.floor(Math.random() * Spec.MAX_INT);
  console.log(startVal);

  var stream = '';
  var writeByte = function (byte) {
    stream += pack('c', byte);
  };

  var readByte = function () {
    var value = stream.substr(pointer, 1);
    pointer += value.length;
    return value.charCodeAt(0);
  };

// type marker
  writeByte(0x04);

  if (startVal < Spec.MIN_INT || startVal > Spec.MAX_INT) {
    throw new Error('Integer out of range: ' + startVal);
  }

  if (startVal < 0 || startVal >= Spec.MIN_4_BYTE_INT) {
    writeByte((startVal >> 22) | 0x80);
    writeByte((startVal >> 15) | 0x80);
    writeByte((startVal >> 8) | 0x80);
    writeByte(startVal);
  } else if (startVal >= Spec.MIN_3_BYTE_INT) {
    writeByte((startVal >> 14) | 0x80);
    writeByte((startVal >> 7) | 0x80);
    writeByte(startVal & 0x7f);
  } else if (startVal >= Spec.MIN_2_BYTE_INT) {
    writeByte((startVal >> 7) | 0x80);
    writeByte(startVal & 0x7f);
  } else {
    writeByte(startVal);
  }

  var marker = readByte();
  var count = 1;
  var endVal = 0;
  var byte = readByte();

  while (((byte & 0x80) != 0) && count < 4) {
    endVal <<= 7;
    endVal |= (byte & 0x7F);
    byte = readByte();
    count++;
  }

  if (count < 4) {
    endVal <<= 7;
    endVal |= byte;
  } else {
    // Use all 8 bits from the 4th byte
    endVal <<= 8;
    endVal |= byte;
  }

  if ((endVal & 0x18000000) == 0x18000000) {
    endVal ^= 0x1fffffff;
    endVal *= -1;
    endVal -= 1;
  } else {
    if ((endVal & 0x10000000) == 0x10000000) {
      // remove the signed flag
      endVal &= 0x0fffffff;
    }
  }

  t.plan(1);

  t.equal(startVal, endVal);
});

// test('is dense array', function(t) {
//   t.plan(6);

//   t.equal(true, Spec.isDenseArray());
//   t.equal(true, Spec.isDenseArray([1,2,3]));
//   t.equal(true, Spec.isDenseArray(["a", "x", "p"]));
//   t.equal(true, Spec.isDenseArray({0: 'hi', 1: 'xxx'}));
//   t.notEqual(true, Spec.isDenseArray({0: 'hi', 2: 'xxx'}));
//   t.notEqual(true, Spec.isDenseArray({'hi': 'xxx'}));
// })