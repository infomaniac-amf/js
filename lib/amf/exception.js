(function(context){

  function newError() {
    return new Error();
  }

  // http://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript

  function extend(base, stack, name) {

    var init = function(message) {
      this.name    = name;
      this.message = message;
      this.stack   = stack;
    };

    init.prototype = base;

    return init;

  }

  context.AMFException = extend(
    newError(),
    newError().stack,
    "AMFException"
  );

  var newAMFException = function() {
    return new context.AMFException();
  };

  context.DeserializationException = extend(
    newAMFException(),
    newError(),
    "DeserializationException"
  );

  context.NotSupportedException = extend(
    newAMFException(),
    newError(),
    "NotSupportedException"
  );

  context.SerializationException = extend(
    newAMFException(),
    newError(),
    "SerializationException"
  );

}(module.exports));
