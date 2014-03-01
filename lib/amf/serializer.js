var BaseSerializer = require('./base.js'),
    Spec = require('./spec.js');

var Serializer = function(stream) {
    BaseSerializer.call(this, stream);
}

Serializer.prototype = new BaseSerializer();
Serializer.prototype.constructor = Serializer;
Serializer.prototype.serialize = function(data, includeType) {
    if(typeof includeType == 'undefined') includeType = true;

    var type = this.getDataType(data);

    // add the AMF type marker for this data before the serialized data is added
    if(includeType) {
        this.stream.writeByte(type);
    }

    switch(type) {
        case Spec.AMF3_UNDEFINED:
        case Spec.AMF3_NULL:
        case Spec.AMF3_FALSE:
        case Spec.AMF3_TRUE:
            // no data is serialized except their type marker
            break;
    }

    return this.stream.getRaw();
};

module.exports = Serializer;