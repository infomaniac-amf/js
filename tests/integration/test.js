var utf8 = require('utf8'),
    base64 = require('base64-js'),
    tape = require('tape');

window.utf8 = utf8;
window.base64 = base64;
window.tape = tape;

window.sendAMFData = function(url, data, callback) {
  if(!XMLHttpRequest.prototype.sendAsBinary) {
    XMLHttpRequest.prototype.sendAsBinary = function(data) {
      var numBytes = data.length, uint8Data = new Uint8Array(numBytes);
      for(var i = 0; i < numBytes; i++) {
        uint8Data[i] = data.charCodeAt(i) & 0xff;
      }

      this.send(uint8Data.buffer);
    };
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", "application/x-amf");
  xhr.overrideMimeType("application/x-amf; charset=x-user-defined");

  xhr.onreadystatechange = function() {
    callback.apply(this, [xhr]);
  };

  xhr.sendAsBinary(data);
};