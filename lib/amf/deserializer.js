var BaseSerializer = require('./base.js'),
    Spec = require('./spec.js');

var Deserializer = function(stream) {
    BaseSerializer.call(this, stream);
}

Deserializer.prototype = new BaseSerializer();
Deserializer.prototype.constructor = Deserializer;
Deserializer.prototype.deserialize = function(data) {
    var type = this.stream.readByte(data);

    switch(type) {
        case Spec.AMF3_UNDEFINED:
            return undefined;
            break;
    }
};

module.exports = Deserializer;