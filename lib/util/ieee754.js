/**
 * @link http://cautionsingularityahead.blogspot.com/2010/04/javascript-and-ieee754-redux.html
 */

module.exports = {
  pack: packFloat64,
  unpack: unpack
};

function packFloat64(v) {

  var ebits = 11;
  var fbits = 52;

  var bias = (1 << (ebits - 1)) - 1,
      s, e, f, ln,
      i, bits, str, bytes;

  // Compute sign, exponent, fraction
  if(isNaN(v)) {
    // http://dev.w3.org/2006/webapi/WebIDL/#es-type-mapping
    e = (1 << bias) - 1;
    f = Math.pow(2, fbits - 1);
    s = 0;
  }
  else if(v === Infinity || v === -Infinity) {
    e = (1 << bias) - 1;
    f = 0;
    s = (v < 0) ? 1 : 0;
  }
  else if(v === 0) {
    e = 0;
    f = 0;
    s = (1 / v === -Infinity) ? 1 : 0;
  }
  else {
    s = v < 0;
    v = Math.abs(v);

    if(v >= Math.pow(2, 1 - bias)) {
      // Normalized
      ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
      e = ln + bias;
      f = Math.round(v * Math.pow(2, fbits - ln) - Math.pow(2, fbits));
    }
    else {
      // Denormalized
      e = 0;
      f = Math.round(v / Math.pow(2, 1 - bias - fbits));
    }
  }

  // Pack sign, exponent, fraction
  bits = [];
  for(i = fbits; i; i -= 1) {
    bits.push(f % 2 ? 1 : 0);
    f = Math.floor(f / 2);
  }
  for(i = ebits; i; i -= 1) {
    bits.push(e % 2 ? 1 : 0);
    e = Math.floor(e / 2);
  }
  bits.push(s ? 1 : 0);
  bits.reverse();
  str = bits.join('');

  // Bits to bytes
  bytes = [];
  while(str.length) {
    bytes.push(parseInt(str.substring(0, 8), 2));
    str = str.substring(8);
  }
  return bytes;
}

function unpack(bytes) {

  var ebits = 11;
  var fbits = 52;

  // Bytes to bits
  var bits = [], i, j, b, str,
      bias, s, e, f;

  for(i = bytes.length; i; i -= 1) {
    b = bytes[i - 1];
    for(j = 8; j; j -= 1) {
      bits.push(b % 2 ? 1 : 0);
      b = b >> 1;
    }
  }
  bits.reverse();
  str = bits.join('');

  // Unpack sign, exponent, fraction
  bias = (1 << (ebits - 1)) - 1;
  s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
  e = parseInt(str.substring(1, 1 + ebits), 2);
  f = parseInt(str.substring(1 + ebits), 2);

  // Produce number
  if(e === (1 << ebits) - 1) {
    return f !== 0 ? NaN : s * Infinity;
  }
  else if(e > 0) {
    // Normalized
    return s * Math.pow(2, e - bias) * (1 + f / Math.pow(2, fbits));
  }
  else if(f !== 0) {
    // Denormalized
    return s * Math.pow(2, -(bias - 1)) * (f / Math.pow(2, fbits));
  }
  else {
    return s < 0 ? -0 : 0;
  }
}