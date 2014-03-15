var amf = require('./lib/amf/amf.js'),
    Spec = require('./lib/amf/spec.js'),
    utf8 = require('utf8'),
    base64 = require('base64-js'),
    tape = require('tape');

var guy = {name: 'Danny'};
var bro = {name: 'Brad'};
var siblings = [guy, bro];
guy.siblings = siblings;

var epoch = new Date(0);
epoch.setMilliseconds(0);

var now = new Date();
now.setMilliseconds(0);

var tests = [
  // strings
  ['empty string', ''],
  ['ascii string', 'Hello World'],
  ['unicode string', 'i ❤ π'],
  // numbers
  ['zero', 0 ],
  ['integer in 1 byte u29 range', 0x7F ],
  ['integer in 2 byte u29 range', 0x00003FFF ],
  ['integer in 3 byte u29 range', 0x001FFFFF ],
  ['integer in 4 byte u29 range', 0x1FFFFFFF ],
  ['large integer', 4294967296 ],
  ['large negative integer', -4294967296 ],
  ['small negative integer', -1 ],
  ['medium negative integer', -199 ],
  ['medium negative integer', -1956 ],
  ['small floating point', 0.123456789 ],
  ['small negative floating point', -0.987654321 ],
  ['Number.MIN_VALUE', Number.MIN_VALUE ],
  ['Number.MAX_VALUE', Number.MAX_VALUE ],
  ['Number.POSITIVE_INFINITY', Number.POSITIVE_INFINITY ],
  ['Number.NEGATIVE_INFINITY', Number.NEGATIVE_INFINITY ],
  ['Number.NaN', Number.NaN],
  // other scalars
  ['Boolean false', false],
  ['Boolean true', true ],
  ['undefined', undefined ],
  ['null', null],
  // Arrays
  ['empty array', [] ],
  ['sparse array', [undefined, undefined, undefined, undefined, undefined, undefined] ],
  ['multi-dimensional array', [
    [
      [],
      []
    ],
    []
  ] ],
  // special objects
  ['date object (epoch)', epoch ],
  ['date object (now)', now ],
  // plain objects
  ['empty object', {} ],
  ['keyed object', { foo: 'bar', 'foo bar': 'baz' } ],
  ['circular object', guy ]
];

window.AMF = amf;
window.Spec = Spec;
window.utf8 = utf8;
window.base64 = base64;
window.tape = tape;
window.tests = tests;
