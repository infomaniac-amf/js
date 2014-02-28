var pack = require('./pack.js');
var test = require('tape');

test('int roundtrip', function (t) {
  var pointer = 0;
  var startVal = Math.floor(Math.random() * 9098763);
  console.log(startVal);

  var Spec = {
    MAX_INT: 0xFFFFFFF,
    MIN_INT: -0x20000000,
    MIN_2_BYTE_INT: 0x80,
    MIN_3_BYTE_INT: 0x4000,
    MIN_4_BYTE_INT: 0x200000
  };

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