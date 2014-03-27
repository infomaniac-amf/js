var ByteArray = function(data) {
  this.data = data;
};

ByteArray.prototype = {
  getData: function() {
    return this.data;
  },

  setData: function(data) {
    this.data = data;
  },

  toString: function() {
    return this.getData();
  }
};

module.exports = ByteArray;