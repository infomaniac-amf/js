var Stream = function(raw) {
  if(!raw || typeof raw == 'undefined') {
    raw = '';
  }

  this.raw = raw.toString();
};

Stream.prototype = {
  getRaw: function() {
    return this.raw;
  },
  toString: function() {
    return this.getRaw();
  }
};

module.exports = Stream;