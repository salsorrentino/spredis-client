var extend = require('util')._extend;  
const Transform = require('stream').Transform;

const defaultOptions = {  
  highWaterMark: 10,
  objectMode: true
};

class Gateway extends Transform {
  
  constructor(options) {
    options = options || extend({}, options || {});
    options = extend(options, defaultOptions);

    super(options);
  }

  _transform(event, encoding, callback) {
    if (event.error && !event.success && !event.id) {
      return callback(new Error(event.error));
    }
    callback(null, event);
  }
}

module.exports = Gateway;
