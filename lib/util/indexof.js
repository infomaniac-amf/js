/**
 * IE8 does not have an indexOf method for Array - motherfucker.
 *
 * Slightly modified version of Mozilla indexOf polyfill
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Compatibility
 */
module.exports = function(array, searchElement, fromIndex) {
  if(array === undefined || array === null) {
    throw new TypeError('"array" is null or not defined');
  }

  var length = array.length >>> 0; // Hack to convert object.length to a UInt32

  fromIndex = +fromIndex || 0;

  if(Math.abs(fromIndex) === Infinity) {
    fromIndex = 0;
  }

  if(fromIndex < 0) {
    fromIndex += length;
    if(fromIndex < 0) {
      fromIndex = 0;
    }
  }

  for(; fromIndex < length; fromIndex++) {
    if(array[fromIndex] === searchElement) {
      return fromIndex;
    }
  }

  return -1;
};