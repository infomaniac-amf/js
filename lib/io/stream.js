var Stream = function(raw) {
    if(!raw) {
        raw = '';
    }

    this.raw = raw.toString();
}

Stream.prototype = {
    getRaw: function() {
        return this.raw;
    },
    toString: function() {
        return this.getRaw();
    }
};

module.exports = Stream;