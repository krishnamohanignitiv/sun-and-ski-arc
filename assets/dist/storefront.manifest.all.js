(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.index = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const B2bAccountSDK = require('mozu-node-sdk/clients/commerce/customer/b2BAccount');
const Client = require('mozu-node-sdk/clients/platform/application');

module.exports = function (context) {
  const payload = Object.assign({}, context.request.body); // eslint-disable-line prefer-object-spread
  const client = new Client({
    context: {
      tenant: 30374,
      site: 50935,
      appKey: 'CosCon.coastal_nawanit_testArc2.1.0.0.Release',
      sharedSecret: '02f7344aa4ab450193edc223a6e7c2f4',
    },
  });

  client.context['user-claims'] = null;

  const b2bAccount = new B2bAccountSDK(client);

  b2bAccount
    .addAccount({}, {
      body: payload,
    })
    .then(res => {
      const { id: accountId } = res;

      return b2bAccount.addSalesRep({ accountId, userId: '5b0e9d19811a4ea99c3588ca64ba61ca' });
    })
    .then(res => {
      const { id: accountId } = res;
      return b2bAccount.accountApprove({ accountId, status: 'approve' });
    })
    .then(res => {
      console.info('Account Created', res);
      context.response.body = 'Account created';
      context.response.end();
    })
    .catch(err => {
      console.log(err);
      context.response.body = err;
      context.response.end();
    });
};

},{"mozu-node-sdk/clients/commerce/customer/b2BAccount":12,"mozu-node-sdk/clients/platform/application":13}],2:[function(require,module,exports){
const request = require('requests');

module.exports = function (context) {
  async function customerValidation() {
    let response;
    await request('https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=100004&limit=5', {
      method: 'GET',
      headers: {
        'x-api-key': '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0',
        siteid: 'coastalone'
      }

    }).on('data', customervalidation => {
      response = customervalidation;
      // console.log('Customer Data', customervalidation);
      // context.response.body = customervalidation;
      // context.response.end();
      // eslint-disable-next-line consistent-return
    }).on('end', err => {
      if (err) {
        // eslint-disable-next-line no-unused-vars
        response = err;
        return console.log('connection closed due to errors', err);
        // console.log('end');
        // callback();
      }
    });
    console.info('Initiating simpleappsapi and added customer data request');
    return response;
  }


  async function invoiceFunction() {
    let response;
    await request('https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=100004&limit=5', {
      method: 'GET',
      headers: {
        'x-api-key': '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0',
        siteid: 'coastalone'
      }

    }).on('data', customervalidation => {
      response = customervalidation;
      console.log('Customer Data', customervalidation);
      // context.response.body = customervalidation;
      // context.response.end();
      // eslint-disable-next-line consistent-return
    }).on('end', err => {
      if (err) {
        // eslint-disable-next-line no-unused-vars
        response = err;
        return console.log('connection closed due to errors', err);
        // console.log('end');
        // callback();
      }
    });
    console.info('Initiating simpleappsapi and added customer data request');
    return response;
  }

  customerValidation().then(res => {
    const parseData = JSON.parse(JSON.parse(res));
    console.log(parseData);
    context.response.body = res;
    context.response.end();
  });

  // function invoiceFunction() {
  //   request('https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=100004&limit=5', {
  //     method: 'GET',
  //     headers: {
  //       'x-api-key': '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0',
  //       siteid: 'coastalone'
  //     }

  //   })

  //     .on('data', chunk => {
  //       console.log('Invoice Data', chunk);
  //       context.response.body = chunk;
  //       context.response.end();
  //     })
  //     .on('end', err => {
  //       if (err) return console.log('connection closed due to errors', err);

  //       console.log('end');
  //       callback();
  //     });

  //   console.info('Initiating simpleappsapi and added Invoice data request');

  //   callback();

  // //Invoice

  // request('https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=100004&limit=5', {
  //     method: 'GET',
  //     headers: {
  //       'x-api-key': '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0',
  //       'siteid': 'coastalone'
  //     }

  //   })

  //   .on('data', function (chunk) {
  //     console.log("Invoice Data", chunk);
  //     context.response.body = chunk;
  //     context.response.end();
  //   })
  //   .on('end', function (err) {
  //     if (err) return console.log('connection closed due to errors', err);

  //     console.log('end');
  //     callback();
  //   });

  // console.info('Initiating simpleappsapi and added Invoice data request');

  // callback();
};

},{"requests":45}],3:[function(require,module,exports){
/* eslint-disable global-require */
module.exports = {
  customer_validation: {
    actionName: 'http.storefront.routes',
    customFunction: require('./domains/storefront/customer_validation'),
    // customRoute: 'coastal/api/customers/customer_validation',
  },
  b2b_user_creation: {
    actionName: 'http.storefront.routes',
    customFunction: require('./domains/storefront/b2b_user_creation'),
    // customRoute: 'coastal/api/commerce/customer/b2baccounts',
  },
};

},{"./domains/storefront/b2b_user_creation":1,"./domains/storefront/customer_validation":2}],4:[function(require,module,exports){
//
// So this might need some explanation. There are firewalls, virus scanners and
// what more that inspect the contents of files that is downloaded over the
// internet and search for potential bad words. Some of them assume that
// ActiveXObject is a bad word and will block the complete file from loading. In
// order to prevent this from happening we've pre-decoded the word ActiveXObject
// by changing the charCodes.
//
module.exports = (function AXO(x, i) {
  var target = typeof global !== 'undefined' ? global : window;

  for (i = 0; i < x.length; i++) {
    x[i] = String.fromCharCode(x[i].charCodeAt(0) + i);
  }

  return target[x.join('')];
})('Abrfr`RHZa[Xh'.split(''));

},{}],5:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],6:[function(require,module,exports){
// 'use strict'; //<-- Root of all evil, causes thrown errors on readyOnly props.

var has = Object.prototype.hasOwnProperty
  , slice = Array.prototype.slice;

/**
 * Copy all readable properties from an Object or function and past them on the
 * object.
 *
 * @param {Object} obj The object we should paste everything on.
 * @returns {Object} obj
 * @api private
 */
function copypaste(obj) {
  var args = slice.call(arguments, 1)
    , i = 0
    , prop;

  for (; i < args.length; i++) {
    if (!args[i]) continue;

    for (prop in args[i]) {
      if (!has.call(args[i], prop)) continue;

      obj[prop] = args[i][prop];
    }
  }

  return obj;
}

/**
 * A proper mixin function that respects getters and setters.
 *
 * @param {Object} obj The object that should receive all properties.
 * @returns {Object} obj
 * @api private
 */
function mixin(obj) {
  if (
       'function' !== typeof Object.getOwnPropertyNames
    || 'function' !== typeof Object.defineProperty
    || 'function' !== typeof Object.getOwnPropertyDescriptor
  ) {
    return copypaste.apply(null, arguments);
  }

  //
  // We can safely assume that if the methods we specify above are supported
  // that it's also save to use Array.forEach for iteration purposes.
  //
  slice.call(arguments, 1).forEach(function forEach(o) {
    Object.getOwnPropertyNames(o).forEach(function eachAttr(attr) {
      Object.defineProperty(obj, attr, Object.getOwnPropertyDescriptor(o, attr));
    });
  });

  return obj;
}

/**
 * Detect if a given parent is constructed in strict mode so we can force the
 * child in to the same mode. It detects the strict mode by accessing properties
 * on the function that are forbidden in strict mode:
 *
 * - `caller`
 * - `callee`
 * - `arguments`
 *
 * Forcing the a thrown TypeError.
 *
 * @param {Function} parent Parent constructor
 * @returns {Function} The child constructor
 * @api private
 */
function mode(parent) {
  try {
    var e = parent.caller || parent.arguments || parent.callee;

    return function child() {
      return parent.apply(this, arguments);
    };
  } catch(e) {}

  return function child() {
    'use strict';

    return parent.apply(this, arguments);
  };
}

//
// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
//
module.exports = function extend(protoProps, staticProps) {
  var parent = this
    , child;

  //
  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  //
  if (protoProps && has.call(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = mode(parent);
  }

  //
  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  //
  function Surrogate() {
    this.constructor = child;
  }

  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  //
  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  //
  if (protoProps) mixin(child.prototype, protoProps);

  //
  // Add static properties to the constructor function, if supplied.
  //
  copypaste(child, parent, staticProps);

  //
  // Set a convenience property in case the parent's prototype is needed later.
  //
  child.__super__ = parent.prototype;

  return child;
};

},{}],7:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty;

/**
 * Return an object with all the information that should be in the JSON output.
 * It doesn't matter if we list keys that might not be in the err as the
 * JSON.stringify will remove properties who's values are set to `undefined`. So
 * we want to make sure that we include some common properties.
 *
 * @returns {Object}
 * @api public
 */
function toJSON() {
  var obj =  { message: this.message, stack: this.stack }, key;

  for (key in this) {
    if (
         has.call(this, key)
      && 'function' !== typeof this[key]
    ) {
      obj[key] = this[key];
    }
  }

  return obj;
}

/**
 * Generate a custom wrapped error object.
 *
 * @param {String|Error} err Error that needs to have additional properties.
 * @param {Object} props Addition properties for the Error.
 * @returns {Error} The generated or returned Error instance
 * @api public
 */
module.exports = function failure(err, props) {
  if (!err) err = 'Unspecified error';
  if ('string' === typeof err) err = new Error(err);

  if (props) for (var prop in props) {
    if (!(prop in err) && has.call(props, prop)) {
      err[prop] = props[prop];
    }
  }

  //
  // Add a custom `toJSON` method so we can generate a useful output when
  // running these objects through JSON.stringify.
  //
  if ('function' !== typeof err.toJSON) err.toJSON = toJSON;
  return err;
};

},{}],8:[function(require,module,exports){
'use strict';

/**
 * Delay function calls only if they are not already ran async.
 *
 * @param {Function} fn Function that should be forced in async execution
 * @returns {Function} A wrapped function that will called the supplied callback.
 * @api public
 */
module.exports = function hang(fn) {
  var start = +(new Date());

  /**
   * The wrapped function.
   *
   * @api private
   */
  function bro() {
    var self = this;

    //
    // Time has passed since we've generated this function so we're going to
    // assume that this function is already executed async.
    //
    if (+(new Date()) > start) {
      return fn.apply(self, arguments);
    }

    for (var i = 0, l = arguments.length, args = new Array(l); i < l; i++) {
      args[i] = arguments[i];
    }

    (global.setImmediate || global.setTimeout)(function delay() {
      fn.apply(self, args);
      self = args = null;
    }, 0);
  }

  //
  // To make debugging more easy we want to use the name of the supplied
  // function. So when you look at the functions that are assigned to event
  // listeners you don't see a load of `onetime` functions but actually the
  // names of the functions that this module will call.
  //
  bro.displayName = fn.displayName || fn.name || bro.displayName || bro.name;

  return bro;
};

},{}],9:[function(require,module,exports){
'use strict';

var response = require('xhr-response')
  , statuscode = require('xhr-status')
  , one = require('one-time')
  , fail = require('failure');

/**
 * Simple nope function that assigned to XHR requests as part of a clean-up
 * operation.
 *
 * @api private
 */
function nope() {}

/**
 * Attach various of event listeners to a given XHR request.
 *
 * @param {XHR} xhr A XHR request that requires listening.
 * @param {EventEmitter} ee EventEmitter that receives events.
 * @api public
 */
function loads(xhr, ee) {
  var onreadystatechange
    , onprogress
    , ontimeout
    , onabort
    , onerror
    , onload
    , timer;

  /**
   * Error listener.
   *
   * @param {Event} evt Triggered error event.
   * @api private
   */
  onerror = xhr.onerror = one(function onerror(evt) {
    var status = statuscode(xhr)
      , err = fail(new Error('Network request failed'), status);

    ee.emit('error', err);
    ee.emit('end', err, status);
  });

  /**
   * Fix for FireFox's odd abort handling behaviour. When you press ESC on an
   * active request it triggers `error` instead of abort. The same is called
   * when an HTTP request is canceled onunload.
   *
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=768596
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=880200
   * @see https://code.google.com/p/chromium/issues/detail?id=153570
   * @param {Event} evt Triggerd abort event
   * @api private
   */
  onabort = xhr.onabort = function onabort(evt) {
    onerror(evt);
  };

  /**
   * ReadyStateChange listener.
   *
   * @param {Event} evt Triggered readyState change event.
   * @api private
   */
  onreadystatechange = xhr.onreadystatechange = function change(evt) {
    var target = evt.target;

    if (4 === target.readyState) return onload(evt);
  };

  /**
   * The connection has timed out.
   *
   * @api private
   */
  ontimeout = xhr.ontimeout = one(function timeout(evt) {
    ee.emit('timeout', evt);

    //
    // Make sure that the request is aborted when there is a timeout. If this
    // doesn't trigger an error, the next call will.
    //
    if (xhr.abort) xhr.abort();
    onerror(evt);
  });

  //
  // Fallback for implementations that did not ship with timer support yet.
  // Microsoft's XDomainRequest was one of the first to ship with `.timeout`
  // support so we all XHR implementations before that require a polyfill.
  //
  // @see https://bugzilla.mozilla.org/show_bug.cgi?id=525816
  //
  if (xhr.timeout) timer = setTimeout(ontimeout, +xhr.timeout);

  /**
   * IE needs have it's `onprogress` function assigned to a unique function. So,
   * no touchy touchy here!
   *
   * @param {Event} evt Triggered progress event.
   * @api private
   */
  onprogress = xhr.onprogress = function progress(evt) {
    var status = statuscode(xhr)
      , data;

    ee.emit('progress', evt, status);

    if (xhr.readyState >= 3 && status.code === 200 && (data = response(xhr))) {
      ee.emit('stream', data, status);
    }
  };

  /**
   * Handle load events an potential data events for when there was no streaming
   * data.
   *
   * @param {Event} evt Triggered load event.
   * @api private
   */
  onload = xhr.onload = one(function load(evt) {
    var status = statuscode(xhr)
      , data = response(xhr);

    if (status.code < 100 || status.code > 599) return onerror(evt);

    //
    // There is a bug in FireFox's XHR2 implementation where status code 204
    // triggers a "no element found" error and bad data. So to be save here,
    // we're just **never** going to emit a `stream` event as for 204's there
    // shouldn't be any content.
    //
    if (data && status.code !== 204) {
      ee.emit('stream', data, status);
    }

    ee.emit('end', undefined, status);
  });

  //
  // Properly clean up the previously assigned event listeners and timers to
  // prevent potential data leaks and unwanted `stream` events.
  //
  ee.once('end', function cleanup() {
    xhr.onreadystatechange = onreadystatechange =
    xhr.onprogress = onprogress =
    xhr.ontimeout = ontimeout =
    xhr.onerror = onerror =
    xhr.onabort = onabort =
    xhr.onload = onload = nope;

    if (timer) clearTimeout(timer);
  });

  return xhr;
}

//
// Expose all the things.
//
module.exports = loads;

},{"failure":7,"one-time":43,"xhr-response":50,"xhr-status":52}],10:[function(require,module,exports){
module.exports={
  "Production/Sandbox": {
    "homeDomain": "https://home.mozu.com",
    "paymentServiceTenantPodDomain": "https://pmts.mozu.com",
    "paymentServiceSandboxDomain": "https://payments-sb.mozu.com"
  },
  "Staging": {
    "homeDomain": "https://home.staging.mozu.com",
    "paymentServiceTenantPodDomain": "http://services.staging-hp.prod.mozu.com",
    "paymentServiceSandboxDomain": "http://services.staging-hp.prod.mozu.com"
  },
  "QA": {
    "homeDomain": "https://home.kibong-qa.com",
    "paymentServiceTenantPodDomain": "https://payments-qa.dev.volusion.com",
    "paymentServiceSandboxDomain": "https://services-sandbox-mozu-qa.dev.volusion.com"
  },
  "Kibodev01": {
    "homeDomain": "https://home.dev01.kubedev.kibo-dev.com",
    "paymentServiceTenantPodDomain": "https://home.dev01.kibo-dev.com",
    "paymentServiceSandboxDomain": "https://home.dev01.kibo-dev.com"
  },
  "SI": {
    "homeDomain": "https://home.mozu-si.com",
    "paymentServiceTenantPodDomain": "https://payments.mozu-si.com",
    "paymentServiceSandboxDomain": "https://payments.mozu-si.com"
  },
  "CI": {
    "homeDomain": "http://aus02ncrprx001.dev.volusion.com",
    "paymentServiceTenantPodDomain": "http://AUS02NCSERV001.dev.volusion.com",
    "paymentServiceSandboxDomain": "http://AUS02NCSERV001.dev.volusion.com"
  }
}

},{}],11:[function(require,module,exports){
'use strict';

var extend = require('./utils/tiny-extend'),
    _sub = require('./utils/sub'),
    constants = require('./constants'),
    makeMethod = require('./utils/make-method'),
    getConfig = require('./utils/get-config'),
    normalizeContext = require('./utils/normalize-context'),
    inMemoryAuthCache = require('./plugins/in-memory-auth-cache'),
    serverSidePrerequisites = require('./plugins/server-side-prerequisites'),
    expandUriTemplateFromContext = require('./plugins/expand-uritemplate-from-context'),
    versionKey = constants.headers.VERSION,
    version = constants.version;

var NodeDefaultPlugins = {
  authenticationStorage: inMemoryAuthCache,
  prerequisiteTasks: serverSidePrerequisites,
  urlResolver: expandUriTemplateFromContext
};

function applyDefaultPlugins(client, plugins) {
  Object.keys(plugins).forEach(function (n) {
    return client[n] = plugins[n](client);
  });
}

function makeClient(clientCls) {
  return function (cfg) {
    return new clientCls(extend({}, this, cfg));
  };
}

function cloneContext(ctx) {
  var newCtx;
  if (!ctx) return {};
  try {
    newCtx = JSON.parse(JSON.stringify(ctx));
  } catch (e) {
    throw new Error('Could not serialize context when creating Client. ' + 'Do not assign non-serializable objects to the client.context.');
  }
  newCtx[versionKey] = newCtx[versionKey] || version;
  return newCtx;
}

function isContextSufficient(context) {
  return context && context.baseUrl;
}

function Client(cfg) {
  cfg = cfg || {};
  var context = normalizeContext(cfg.apiContext || cfg.context || {});
  if (!isContextSufficient(context)) {
    context = context ? extend(getConfig(), context) : getConfig();
  }
  this.context = cloneContext(context);
  this.defaultRequestOptions = extend({}, Client.defaultRequestOptions, cfg.defaultRequestOptions);
  // apply the right default plugin config for a server-side environment
  // (that is, Node, ArcJS, or perhaps Rhino/Nashorn/WinJS)
  if (typeof process !== "undefined") {
    applyDefaultPlugins(this, NodeDefaultPlugins);
  }
  if (cfg.plugins) {
    // override plugins if necessary
    this.plugins = cfg.plugins.slice();
    this.plugins.forEach(function (p) {
      p(this);
    }.bind(this));
  }
}

// statics
extend(Client, {
  defaultRequestOptions: {},
  method: makeMethod,
  sub: function sub(methods) {
    return makeClient(_sub(Client, methods));
  },
  constants: constants
});

module.exports = Client;
},{"./constants":15,"./plugins/expand-uritemplate-from-context":16,"./plugins/in-memory-auth-cache":17,"./plugins/server-side-prerequisites":23,"./utils/get-config":28,"./utils/make-method":30,"./utils/normalize-context":31,"./utils/sub":35,"./utils/tiny-extend":37}],12:[function(require,module,exports){
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by CodeZu.     
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

var Client = require('../../../client'), constants = Client.constants;

module.exports = Client.sub({
	getB2BAccounts: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/?startIndex={startIndex}&pageSize={pageSize}&sortBy={sortBy}&filter={filter}&fields={fields}&q={q}&qLimit={qLimit}&responseFields={responseFields}'
	}),
	getB2BAccountAttribute: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/attributes/{attributeFQN}?responseFields={responseFields}'
	}),
	getB2BAccountAttributes: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/attributes?startIndex={startIndex}&pageSize={pageSize}&sortBy={sortBy}&filter={filter}&responseFields={responseFields}'
	}),
	getUserRolesAsync: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/user/{userId}/roles?responseFields={responseFields}'
	}),
	getUsers: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/users?startIndex={startIndex}&pageSize={pageSize}&sortBy={sortBy}&filter={filter}&q={q}&qLimit={qLimit}&responseFields={responseFields}'
	}),
	getB2BAccount: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}?responseFields={responseFields}'
	}),
	addAccount: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/?responseFields={responseFields}'
	}),
	addB2BAccountAttribute: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/attributes?responseFields={responseFields}'
	}),
	addUserRoleAsync: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/user/{userId}/roles/{roleId}'
	}),
	addUser: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/user?responseFields={responseFields}'
	}),
	updateB2BAccountAttribute: Client.method({
		method: constants.verbs.PUT,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/attributes/{attributeFQN}?responseFields={responseFields}'
	}),
	removeUser: Client.method({
		method: constants.verbs.PUT,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/user/{userId}/remove'
	}),
	updateUser: Client.method({
		method: constants.verbs.PUT,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/user/{userId}?responseFields={responseFields}'
	}),
	updateAccount: Client.method({
		method: constants.verbs.PUT,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}?responseFields={responseFields}'
	}),
	deleteB2BAccountAttribute: Client.method({
		method: constants.verbs.DELETE,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/attributes/{attributeFQN}'
	}),
	removeUserRoleAsync: Client.method({
		method: constants.verbs.DELETE,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/user/{userId}/roles/{roleId}'
	}),
	addSalesRep: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/salesrep/{userId}'
	}),
	accountApprove: Client.method({
		method: constants.verbs.PUT,
		url: '{+tenantPod}api/commerce/customer/b2baccounts/{accountId}/status/{status}'
	})
});
},{"../../../client":11}],13:[function(require,module,exports){


//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by CodeZu.     
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

var Client = require('../../client'), constants = Client.constants;

module.exports = Client.sub({
	getAppPackageNames: Client.method({
		method: constants.verbs.GET,
		url: '{+homePod}api/platform/developer/applications/{applicationKey}/packagenames?responseFields={responseFields}'
	}),
	getAppVersions: Client.method({
		method: constants.verbs.GET,
		url: '{+homePod}api/platform/developer/applications/versions/{nsAndAppId}?responseFields={responseFields}'
	}),
	getPackageFileMetadata: Client.method({
		method: constants.verbs.GET,
		url: '{+homePod}api/platform/developer/packages/{applicationKey}/filemetadata/{filepath}?responseFields={responseFields}'
	}),
	getPackageMetadata: Client.method({
		method: constants.verbs.GET,
		url: '{+homePod}api/platform/developer/packages/{applicationKey}/metadata?responseFields={responseFields}'
	}),
	upsertPackageFile: Client.method({
		method: constants.verbs.POST,
		url: '{+homePod}api/platform/developer/packages/{applicationKey}/files/{filepath}?lastModifiedTime={lastModifiedTime}&responseFields={responseFields}'
	}),
	renamePackageFile: Client.method({
		method: constants.verbs.POST,
		url: '{+homePod}api/platform/developer/packages/{applicationKey}/files_rename?responseFields={responseFields}'
	}),
	deletePackageFile: Client.method({
		method: constants.verbs.DELETE,
		url: '{+homePod}api/platform/developer/packages/{applicationKey}/files/{filepath}'
	})
});

},{"../../client":11}],14:[function(require,module,exports){


//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by CodeZu.     
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

var Client = require('../../client'), constants = Client.constants;

module.exports = Client.sub({
	getTenant: Client.method({
		method: constants.verbs.GET,
		url: '{+homePod}api/platform/tenants/{tenantId}?responseFields={responseFields}'
	})
});

},{"../../client":11}],15:[function(require,module,exports){
'use strict';

var version = require('./version'),
    DEVELOPER = 1,
    ADMINUSER = 2,
    SHOPPER = 4,
    TENANT = 8,
    SITE = 16,
    MASTERCATALOG = 32,
    CATALOG = 64,
    APP_ONLY = 128,
    NONE = 256,
    APP_REQUIRED = 512;

// scopes are not yet in use, but when the services can reflect
// their required scope, here will be all the bitmask constants

// some contexts are always additive

TENANT |= ADMINUSER;
SITE |= TENANT;
MASTERCATALOG |= TENANT;
CATALOG |= MASTERCATALOG;
SHOPPER |= SITE | CATALOG;

module.exports = {
  scopes: {
    APP_REQUIRED: APP_REQUIRED,
    DEVELOPER: DEVELOPER,
    ADMINUSER: ADMINUSER,
    SHOPPER: SHOPPER,
    TENANT: TENANT,
    SITE: SITE,
    MASTERCATALOG: MASTERCATALOG,
    CATALOG: CATALOG,
    APP_ONLY: APP_ONLY,
    NONE: NONE
  },
  verbs: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
  },
  headerPrefix: 'x-vol-',
  headers: {
    APPCLAIMS: 'app-claims',
    USERCLAIMS: 'user-claims',
    TENANT: 'tenant',
    SITE: 'site',
    MASTERCATALOG: 'master-catalog',
    CATALOG: 'catalog',
    DATAVIEWMODE: 'dataview-mode',
    VERSION: 'version',
    SHA256: 'hmac-sha256',
    JWT: 'jwt'
  },
  jwtHeader: 'Authorization',
  jwtHeaderValuePrefix: 'Bearer ',
  dataViewModes: {
    LIVE: 'Live',
    PENDING: 'Pending'
  },
  capabilityTimeoutInSeconds: 180,
  version: version.current
};
},{"./version":39}],16:[function(require,module,exports){
'use strict';

var getUrlTemplate = require('../utils/get-url-template');
var extend = require('../utils/tiny-extend');

function ensureTrailingSlash(url) {
  return url.charAt(url.length - 1) === '/' ? url : url + '/';
}

/**
 * Creates, evaluates based on context, and returns a string URL for a Mozu API request.
 * @param  {Object} context The context of a client. Should have a `baseUrl` property at minimum.
 * @param  {string} tpt     A string to be compiled into a UriTemplate. Should be a valid UriTemplate.
 * @param  {Object} body      An object consisting of the JSON body of the request, to be used to interpolate URL paramters.
 * @return {string}         A fully qualified URL.
 */
module.exports = function () {
  return function (client, tpt, body) {
    var context = client.context;
    var template = getUrlTemplate(tpt);
    var fullTptEvalCtx = extend(
    // aliases for pod URLs and IDs first
    {
      homePod: context.baseUrl,
      pciPod: context.basePciUrl,
      tenantId: context.tenant,
      siteId: context.site,
      catalogId: context.catalog,
      masterCatalogId: context['master-catalog']
    },
    // all context values override those base values if provided
    context,
    // any matching values in the body override last.
    body);

    // ensure all base URLs have trailing slashes.
    ['homePod', 'pciPod', 'tenantPod'].forEach(function (x) {
      if (fullTptEvalCtx[x]) fullTptEvalCtx[x] = ensureTrailingSlash(fullTptEvalCtx[x]);
    });

    // don't pass the API version!
    if (!body || !Object.prototype.hasOwnProperty.call(body, "version")) delete fullTptEvalCtx.version;

    return template.render(fullTptEvalCtx);
  };
};
},{"../utils/get-url-template":29,"../utils/tiny-extend":37}],17:[function(require,module,exports){
'use strict';

var assert = require('assert');

function isExpired(ticket) {
  var ungraceperiod = 60000;
  var compareDate = new Date();
  compareDate.setTime(compareDate.getTime() + ungraceperiod);
  return new Date(ticket.refreshTokenExpiration) < compareDate;
}

function generateCacheKey(claimtype, context) {
  var cmps;
  if (!process.env.mozuHosted) {
    assert(context.appKey, "No application key in context!");
    cmps = [context.appKey];
  } else {
    cmps = ['mozuHosted'];
  }
  switch (claimtype) {
    case "developer":
      assert(context.developerAccount && context.developerAccount.emailAddress, "No developer account email address in context!");
      cmps.push(context.developerAccount.emailAddress, context.developerAccountId);
      break;
    case "admin-user":
      assert(context.tenant, "No tenant in context!");
      assert(context.adminUser && context.adminUser.emailAddress, "No admin user email address in context!");
      cmps.push(context.tenant, context.adminUser.emailAddress);
      break;
    default:
      break;
  }
  return cmps.join();
}

module.exports = function InMemoryAuthCache() {
  var claimsCaches = {
    application: {},
    developer: {},
    'admin-user': {}
  };

  return {
    get: function get(claimtype, context, callback) {
      var ticket = claimsCaches[claimtype][generateCacheKey(claimtype, context)];
      setImmediate(function () {
        callback(null, ticket && !isExpired(ticket) && ticket || undefined);
      });
    },
    set: function set(claimtype, context, ticket, callback) {
      claimsCaches[claimtype][generateCacheKey(claimtype, context)] = ticket;
      setImmediate(callback);
    },
    constructor: InMemoryAuthCache
  };
};
},{"assert":undefined}],18:[function(require,module,exports){
'use strict';

var AuthProvider = require('../../security/auth-provider');
var scopes = require('../../constants').scopes;
var getScopeFromState = require('./get-scope-from-state');

/**
 * If necessary, add application claims to a client context before
 * placing a request. Relies on a `scope` parameter to specify.
 * Uses AuthProvider.
 */

module.exports = function (state) {
  var client = state.client;

  var scope = getScopeFromState(state);

  if (scope & scopes.APP_REQUIRED || !(scope & scopes.NONE || scope & scopes.DEVELOPER)) {
    return AuthProvider.addPlatformAppClaims(client).then(function () {
      return state;
    });
  } else {
    return state;
  }
};
},{"../../constants":15,"../../security/auth-provider":24,"./get-scope-from-state":22}],19:[function(require,module,exports){
'use strict';

var TenantCache = require('../../utils/tenant-cache');
var EnvUrls = require('mozu-metadata/data/environments.json');
var getUrlTemplate = require('../../utils/get-url-template');
var getScopeFromState = require('./get-scope-from-state');

/**
 * If necessary, transforms a promise for a prepared client into a promise
 * for a client that has a `basePciUrl` in its context.
 * Reads from the TenantCache if necessary, and consumes mozu-metadata.
 */

var PCIUrlsByBaseUrl = Object.keys(EnvUrls).reduce(function (o, c) {
  o[EnvUrls[c].homeDomain] = EnvUrls[c];
  return o;
}, {});

module.exports = function (state) {
  var client = state.client;
  var requestConfig = state.requestConfig;
  var url = requestConfig.url;

  if (~getUrlTemplate(url).keysUsed.indexOf('pciPod') && !client.context.basePciUrl && !client.context.pciPod) {
    var tenantId = client.context.tenantId || client.context.tenant;
    var pciUrls = PCIUrlsByBaseUrl[client.context.baseUrl];
    if (!tenantId) {
      throw new Error('Could not place request to ' + url + ' because it requires a tenant ' + 'ID to be set in the client context.');
    } else if (!pciUrls) {
      throw new Error('Could not place request to ' + url + ' because it is making a call to ' + 'Payment Service, but there is no known payment service domain ' + ('matching the environment whose base URL is ' + client.context.baseUrl + '.'));
    } else {
      return TenantCache.get(tenantId, client, getScopeFromState(state)).then(function (t) {
        if (t.isDevTenant) {
          client.context.basePciUrl = pciUrls.paymentServiceSandboxDomain;
        } else {
          client.context.basePciUrl = pciUrls.paymentServiceTenantPodDomain;
        }
        return state;
      });
    }
  } else {
    return state;
  }
};
},{"../../utils/get-url-template":29,"../../utils/tenant-cache":36,"./get-scope-from-state":22,"mozu-metadata/data/environments.json":10}],20:[function(require,module,exports){
'use strict';

var TenantCache = require('../../utils/tenant-cache');
var getUrlTemplate = require('../../utils/get-url-template');
var getScopeFromState = require('./get-scope-from-state');

/**
 * If necessary, transforms a promise for a prepared client into a promise
 * for a client that has a `tenantPod` in its context.
 * Reads from the TenantCache if necessary.
 */

module.exports = function (state) {
  var client = state.client;
  var requestConfig = state.requestConfig;
  var url = requestConfig.url;

  if (~getUrlTemplate(url).keysUsed.indexOf('tenantPod') && !client.context.tenantPod) {
    var tenantId = client.context.tenantId || client.context.tenant;
    if (!tenantId) {
      throw new Error('Could not place request to ' + url + ' because it requires a tenant ' + 'ID to be set in the client context.');
    } else {
      return TenantCache.get(tenantId, client, getScopeFromState(state)).then(function (tenant) {
        client.context.tenantPod = 'https://' + tenant.domain + '/';
        return state;
      });
    }
  } else {
    return state;
  }
};
},{"../../utils/get-url-template":29,"../../utils/tenant-cache":36,"./get-scope-from-state":22}],21:[function(require,module,exports){
'use strict';

var AuthProvider = require('../../security/auth-provider');
var scopes = require('../../constants').scopes;
var getScopeFromState = require('./get-scope-from-state');

/**
 * If necessary, add developer user claims to a client context before
 * placing a request. Relies on a `scope` parameter to specify.
 * Uses AuthProvider.
 */

module.exports = function (state) {
  var client = state.client;
  var scope = getScopeFromState(state);

  if (scope & scopes.DEVELOPER) {
    return AuthProvider.addDeveloperUserClaims(client).then(function () {
      return state;
    });
  } else if (scope & scopes.ADMINUSER) {
    return AuthProvider.addAdminUserClaims(client).then(function () {
      return state;
    });
  } else if (!scope && AuthProvider.addMostRecentUserClaims) {
    return AuthProvider.addMostRecentUserClaims(client).then(function () {
      return state;
    });
  } else {
    return state;
  }
};
},{"../../constants":15,"../../security/auth-provider":24,"./get-scope-from-state":22}],22:[function(require,module,exports){
'use strict';

var scopes = require('../../constants').scopes;

/**
 * From a given prerequisite state object (config, options, requestConfig)
 * return scope.
 */

module.exports = function (state) {
  var requestConfig = state.requestConfig;
  var options = state.options;

  if (options && options.scope) {
    if (scopes[options.scope]) {
      return scopes[options.scope];
    } else {
      return options.scope;
    }
  } else {
    return requestConfig.scope;
  }
};
},{"../../constants":15}],23:[function(require,module,exports){
'use strict';
/**
 * Sensible default configuration for a NodeJS, ArcJS, or other server env.
 * Includes assumptions that you'll have access to Tenant Service, etc.
 * Not appropriate for shopper or storefront use.
 */

module.exports = function () {
  return [require('./ensure-tenant-pod-url'), require('./ensure-pci-pod-url'), require('./ensure-user-claims'), require('./ensure-app-claims')];
};
},{"./ensure-app-claims":18,"./ensure-pci-pod-url":19,"./ensure-tenant-pod-url":20,"./ensure-user-claims":21}],24:[function(require,module,exports){
/* eslint handle-callback-err: 0 */
'use strict';

var constants = require('../constants'),
    AuthTicket = require('./auth-ticket'),
    scopes = constants.scopes;

var TenantCache = require('../utils/tenant-cache');

// if (typeof Promise !== "function") require('when/es6-shim/Promise.browserify-es6');

function createMemoizedClientFactory(clientPath) {
  var c;
  return function () {
    return (c || (c = require(clientPath))).apply(this, arguments);
  };
}

var makeAppAuthClient = createMemoizedClientFactory('../clients/platform/applications/authTicket');
var makeDeveloperAuthClient = createMemoizedClientFactory('../clients/platform/developer/developerAdminUserAuthTicket');
var makeAdminUserAuthClient = createMemoizedClientFactory('../clients/platform/adminuser/tenantAdminUserAuthTicket');

function cacheDataAndCreateAuthTicket(res) {
  var tenants = res.availableTenants;
  if (tenants) {
    for (var i = 0; i < tenants.length; i++) {
      TenantCache.add(tenants[i]);
    }
  }
  return new AuthTicket(res);
}

function getPlatformAuthTicket(client) {
  return makeAppAuthClient(client).authenticateApp({
    applicationId: client.context.appKey,
    sharedSecret: client.context.sharedSecret
  }, {
    scope: scopes.NONE
  }).then(cacheDataAndCreateAuthTicket);
}

function refreshPlatformAuthTicket(client, ticket) {
  return makeAppAuthClient(client).refreshAppAuthTicket({
    refreshToken: ticket.refreshToken
  }, {
    scope: scopes.NONE
  }).then(cacheDataAndCreateAuthTicket);
}

function getDeveloperAuthTicket(client) {
  return makeDeveloperAuthClient(client).createDeveloperUserAuthTicket(client.context.developerAccount, {
    scope: scopes.NONE
  }).then(cacheDataAndCreateAuthTicket);
}

function refreshDeveloperAuthTicket(client, ticket) {
  return makeDeveloperAuthClient(client).refreshDeveloperAuthTicket(ticket, {
    scope: scopes.NONE
  }).then(cacheDataAndCreateAuthTicket);
}

function getAdminUserAuthTicket(client) {
  return makeAdminUserAuthClient(client).createUserAuthTicket({ tenantId: client.context.tenant }, {
    body: client.context.adminUser,
    scope: constants.scopes.APP_ONLY
  }).then(function (json) {
    client.context.user = json.user;
    return cacheDataAndCreateAuthTicket(json);
  });
}

function refreshAdminUserAuthTicket(client, ticket) {
  return makeAdminUserAuthClient(client).refreshAuthTicket(ticket, {
    scope: constants.scopes.APP_ONLY
  }).then(cacheDataAndCreateAuthTicket);
}

var calleeToClaimType = {
  'addPlatformAppClaims': 'application',
  'addDeveloperUserClaims': 'developer',
  'addAdminUserClaims': 'admin-user'
};

function makeClaimMemoizer(calleeName, requester, refresher, claimHeader) {
  return function (client) {
    var cacheAndUpdateClient = function cacheAndUpdateClient(ticket) {
      return new Promise(function (resolve) {
        client.authenticationStorage.set(calleeToClaimType[calleeName], client.context, ticket, function () {
          client.context[claimHeader] = ticket.accessToken;
          resolve(client);
        });
      });
    };
    var op = new Promise(function (resolve) {
      client.authenticationStorage.get(calleeToClaimType[calleeName], client.context, function (err, ticket) {
        resolve(ticket);
      });
    }).then(function (ticket) {
      if (!ticket) {
        return requester(client).then(cacheAndUpdateClient);
      }
      if (new Date(ticket.accessTokenExpiration) < new Date()) {
        return refresher(client, ticket).then(cacheAndUpdateClient);
      }
      client.context[claimHeader] = ticket.accessToken;
      return client;
    });
    function setRecent() {
      AuthProvider.addMostRecentUserClaims = AuthProvider[calleeName];
    }
    op.then(setRecent, setRecent);
    return op;
  };
}

var AuthProvider = {

  addPlatformAppClaims: makeClaimMemoizer('addPlatformAppClaims', getPlatformAuthTicket, refreshPlatformAuthTicket, constants.headers.APPCLAIMS),
  addDeveloperUserClaims: makeClaimMemoizer('addDeveloperUserClaims', getDeveloperAuthTicket, refreshDeveloperAuthTicket, constants.headers.USERCLAIMS),
  addAdminUserClaims: makeClaimMemoizer('addAdminUserClaims', getAdminUserAuthTicket, refreshAdminUserAuthTicket, constants.headers.USERCLAIMS),
  addMostRecentUserClaims: false
};

module.exports = AuthProvider;
},{"../constants":15,"../utils/tenant-cache":36,"./auth-ticket":25}],25:[function(require,module,exports){
'use strict';

/**
 * The authentication ticket used to authenticate anything.
 * @class AuthTicket
 * @property {string} accessToken The token that stores an encrypted list of the application's configured behaviors and authenticates the application.
 * @property {Date} accessTokenExpiration Date and time the access token expires. After the access token expires, refresh the authentication ticket using the refresh token.
 * @property {string} refreshToken The token that refreshes the application's authentication ticket.
 * @property {Date} refreshTokenExpiration Date and time the refresh token expires. After the refresh token expires, generate a new authentication ticket.
 */

function AuthTicket(json) {
  var self = this;
  if (!(this instanceof AuthTicket)) return new AuthTicket(json);
  for (var p in json) {
    if (Object.prototype.hasOwnProperty.call(json, p)) {
      self[p] = p.indexOf('Expiration') !== -1 ? new Date(json[p]) : json[p]; // dateify the dates, this'll break if the prop name changes
    }
  }
}

module.exports = AuthTicket;
},{}],26:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
  deepClone: function deepClone(inObj) {
    var outObj = void 0,
        key = void 0,
        val = void 0;

    if ((typeof inObj === 'undefined' ? 'undefined' : _typeof(inObj)) !== 'object' || inObj === null) return inObj;

    outObj = inObj instanceof Array ? [] : Object.create(Object.getPrototypeOf(inObj));

    for (key in inObj) {
      if (Object.prototype.hasOwnProperty.call(inObj, key)) {
        val = inObj[key];
        outObj[key] = deepClone(val);
      }
    }

    return outObj;
  }
};
},{}],27:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var extend = require('./tiny-extend');
var util = require('util');
module.exports = function errorify(res, additions) {
  try {
    if (typeof res === "string") {
      return new Error(res);
    }
    var err;
    var message = ensureMessage(res);
    var stringBody = ensureString(res.body);
    var details = _typeof(res.body) === "object" ? res.body : (typeof res === 'undefined' ? 'undefined' : _typeof(res)) === "object" ? res : {};

    if (!message && stringBody) {
      try {
        details = JSON.parse(stringBody);
        message = details.message || stringBody;
      } catch (e) {
        message = stringBody;
      }
    }

    if (additions) {
      extend(details, additions);
    }

    message = (message || "Unknown error!") + formatDetails(details);

    err = new Error(message);
    err.originalError = details;
    return err;
  } catch (e) {
    return e;
  }
};

function formatDetails(deets) {
  return "\n\nDetails:\n" + Object.keys(deets).map(function (label) {
    var deet = deets[label];
    if ((typeof deet === 'undefined' ? 'undefined' : _typeof(deet)) === "object") deet = util.inspect(deet);
    return " " + label + ": " + deet;
  }).join('\n') + '\n';
}

function ensureString(something) {
  if (!something) return String(something);
  if (typeof something === "string") {
    return something;
  }
  if (Buffer.isBuffer(something)) {
    return something.toString('utf-8');
  }
  if (typeof something.toString === "function") {
    return something.toString();
  }
  return String(something);
}

function ensureMessage(res) {
  return res.message || res.body && res.body.message;
}
},{"./tiny-extend":37,"util":undefined}],28:[function(require,module,exports){
'use strict';
// BEGIN INIT

var fs = require('fs');
var findup = require('./tiny-findup');

var legalConfigNames = ['mozu.config', 'mozu.config.json'];

module.exports = function getConfig() {
  var conf;
  if (process.env.mozuHosted) {
    try {
      conf = JSON.parse(process.env.mozuHosted).sdkConfig;
    } catch (e) {
      throw new Error("Mozu hosted configuration was unreadable: " + e.message);
    }
  } else {
    for (var i = legalConfigNames.length - 1; i >= 0; i--) {
      try {
        var filename = findup(legalConfigNames[i]);
        if (filename) conf = fs.readFileSync(filename, 'utf-8');
      } catch (e) {
        continue;
      }
      if (conf) break;
    }
    if (!conf) {
      throw new Error("No configuration file found. Either create a 'mozu.config' or 'mozu.config.json' file, or supply full config to the .client() method.");
    }
    try {
      conf = JSON.parse(conf);
    } catch (e) {
      throw new Error("Configuration file was unreadable: " + e.message);
    }
  }
  return conf;
};
},{"./tiny-findup":38,"fs":undefined}],29:[function(require,module,exports){
'use strict';
/**
 * Memoized function to turn URI Template text strings into Template objects.
 *
 * Assumes that unescaped URI Template variables are required,
 * since they're always base URLs in the current codegen.
 *
 * @param {String} templateText The URI template string.
 * @returns {Template} Object with a `render` method and a `keysUsed` object.
 */

var expRe = /\{.+?\}/g;
var varnameRe = /[\w_-]+/;
function findKeys(rawTpt) {
  var matches = rawTpt.match(expRe);
  if (!matches) return [];
  return matches.map(function (x) {
    return x.match(varnameRe)[0];
  });
}

var uritemplate = require('uri-template');
var cache = {};
module.exports = function (templateText) {
  if (cache[templateText]) {
    return cache[templateText];
  }
  var tpt = uritemplate.parse(templateText);
  return cache[templateText] = {
    render: function render(x) {
      return tpt.expand(x);
    },
    keysUsed: findKeys(templateText)
  };
};
},{"uri-template":47}],30:[function(require,module,exports){
'use strict';

var extend = require('./tiny-extend');
var request = require('./request');

module.exports = function (config) {

  function doRequest(body, options) {
    options = options || {};
    var finalRequestConfig = extend({}, config, this.defaultRequestOptions, {
      url: this.urlResolver(this, config.url, body),
      context: this.context,
      body: body
    }, options);
    var finalMethod = finalRequestConfig.method && finalRequestConfig.method.toUpperCase();

    // this is magic and was never a good idea.
    // the way the SDK was designed, the first argument to a method will get
    // used both as the request payload and as an object to expand the URI
    // template. this resulted in collisions, and in unexpected behavior with
    // services that didn't expect strongly typed payloads. the below code
    // tried to fix it magically, but under certain circumstances it would be
    // very hard to debug.
    //
    // remove any properties from the body that were used to expand the url
    // if (body && 
    //     typeof body === "object" &&
    //     !Array.isArray(body) &&
    //     !options.body && 
    //     !options.includeUrlVariablesInPostBody && 
    //     (finalMethod === "POST" || finalMethod === "PUT")) {
    //   finalRequestConfig.body = Object.keys(body).reduce(function(m, k) {
    //     if (!urlSpec.keysUsed[k]) {
    //       m[k] = body[k];
    //     }
    //     return m;
    //   }, {});
    //   if (Object.keys(finalRequestConfig.body).length === 0) {
    //     delete finalRequestConfig.body;
    //   }
    // }


    if (finalMethod === "GET" || finalMethod === "DELETE" && !options.body) {
      delete finalRequestConfig.body;
      // it's outlived its usefulness, we've already made a url with it
    }
    return request(finalRequestConfig, this.requestTransform);
  }

  return function (body, options) {
    var doThisRequest = doRequest.bind(this, body, options);
    if (process.env.mozuHosted) {
      return doThisRequest();
    } else if (!this.prerequisiteTasks || !Array.isArray(this.prerequisiteTasks)) {
      return Promise.reject(new Error('Could not place request. No `prerequisiteTasks` array found on ' + 'the client object. To require no auth or URL prerequisites, set ' + '`this.prerequisiteTasks = [];` on the client object.'));
    } else {
      return this.prerequisiteTasks.reduce(function (p, t) {
        return p.then(t);
      }, Promise.resolve({
        client: this,
        options: options,
        requestConfig: config
      })).then(doThisRequest);
    }
  };
};
},{"./request":33,"./tiny-extend":37}],31:[function(require,module,exports){
'use strict';

var extend = require('./tiny-extend');

var priorities = {
  'app-claims': ['appClaims'],
  'user-claims': ['userClaims'],
  'tenant': ['tenantId'],
  'site': ['siteId'],
  'master-catalog': ['masterCatalog', 'masterCatalogId'],
  'catalog': ['catalogId'],
  'dataview-mode': ['dataViewMode']
};

var prioritiesKeys = Object.keys(priorities);

module.exports = function (context) {
  var newContext = extend({}, context);
  return prioritiesKeys.reduce(function (ctx, dashKey) {
    return priorities[dashKey].reduce(function (ctx, k) {
      if (k in ctx) {
        ctx[dashKey] = ctx[k];
        delete ctx[k];
      }
      return ctx;
    }, ctx);
  }, newContext);
};
},{"./tiny-extend":37}],32:[function(require,module,exports){
'use strict';

var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
module.exports = function parseDate(key, value) {
  return typeof value === 'string' && reISO.exec(value) ? new Date(value) : value;
};
},{}],33:[function(require,module,exports){
/* eslint-disable complexity */
'use strict';

var constants = require('../constants');
var extend = require('./tiny-extend');
var url = require('url');
var protocolHandlers = {
  'http:': require('http'),
  'https:': require('https')
};
var streamToCallback = require('./stream-to-callback');
var parseJsonDates = require('./parse-json-dates');
var errorify = require('./errorify');

var USER_AGENT = 'Mozu Node SDK v' + constants.version + ' (Node.js ' + process.version + '; ' + process.platform + ' ' + process.arch + ')';

/**
 * Handle headers
 */
function makeHeaders(conf, payload) {
  var headers;
  function iterateHeaders(memo, key) {
    if (conf.context[constants.headers[key]]) {
      if (key === 'JWT') {
        memo[constants.jwtHeader] = conf.context[constants.headers[key]].indexOf(constants.jwtHeaderValuePrefix) === -1 ? constants.jwtHeaderValuePrefix + conf.context[constants.headers[key]] : conf.context[constants.headers[key]];
      } else {
        memo[constants.headerPrefix + constants.headers[key]] = conf.context[constants.headers[key]];
      }
    }
    return memo;
  }
  if (conf.scope && conf.scope & constants.scopes.NONE) {
    headers = {};
  } else if (conf.scope && conf.scope & constants.scopes.APP_ONLY) {
    headers = ['APPCLAIMS'].reduce(iterateHeaders, {});
  } else {
    headers = Object.keys(constants.headers).reduce(iterateHeaders, {});
  }

  if (payload) {
    headers['Content-Length'] = payload.length.toString();
  }

  if (headers['Authorization'] && headers['x-vol-user-claims']) delete headers['x-vol-user-claims'];
  if (headers['Authorization'] && headers['x-vol-app-claims']) delete headers['x-vol-app-claims'];

  return extend({
    'Accept': 'application/json',
    'Connection': 'close',
    'Content-Type': 'application/json; charset=utf-8',
    'User-Agent': USER_AGENT
  }, headers, conf.headers || {});
}

/**
 * Make an HTTP request to the Mozu API. This method populates headers based on the scope of the supplied context.
 * @param  {Object} options The request options, to be passed to the `request` module. Look up on NPM for details.
 * @return {Promise<ApiResponse,ApiError>}         A Promise that will fulfill as the JSON response from the API, or reject with an error as JSON from the API.
 */

module.exports = function (options, transform) {
  var conf = extend({}, options);
  conf.method = (conf.method || 'get').toUpperCase();
  var payload;
  if (conf.body) {
    payload = conf.body;
    if (typeof payload !== "string" && !Buffer.isBuffer(payload)) {
      payload = JSON.stringify(payload);
    }
    if (typeof payload === "string") {
      payload = new Buffer(payload);
    }
  }
  conf.headers = makeHeaders(conf, payload);
  var uri = url.parse(conf.url);
  var protocolHandler = protocolHandlers[uri.protocol];
  if (!protocolHandler) {
    throw new Error('Protocol ' + uri.protocol + ' not supported.');
  }
  return new Promise(function (resolve, reject) {
    options = extend({}, options);
    delete options.headers;
    var requestOptions = extend({
      hostname: uri.hostname,
      port: uri.port || (uri.protocol === 'https:' ? 443 : 80),
      method: conf.method,
      path: uri.path,
      headers: conf.headers,
      agent: conf.agent
    }, options);
    if (typeof transform === "function") {
      requestOptions = transform(requestOptions);
    }
    var complete = false;
    var request = protocolHandler.request(requestOptions, function (response) {
      streamToCallback(response, function (err, body) {
        complete = true;
        if (err) return reject(errorify(err, extend({ statusCode: response.statusCode, url: response.req.path }, response.headers)));
        if (body) {
          try {
            if (response.headers["content-type"] && (response.headers["content-type"].indexOf('json') > -1 || response.headers["content-type"].indexOf('text/plain') > -1)) body = JSON.parse(body, conf.parseDates !== false && parseJsonDates);
          } catch (e) {
            return reject(new Error('Response was not valid JSON: ' + e.message + '\n\n-----\n' + body));
          }
        }
        if (response && response.statusCode >= 400 && response.statusCode < 600) {
          return reject(errorify(body || response, extend({ statusCode: response.statusCode, url: response.req ? response.req.path : "" }, response.headers)));
        }
        return resolve(body);
      });
    });
    var timeout = options.timeout || 20000;
    request.setTimeout(timeout, function () {
      if (!complete) {
        request.abort();
        reject(errorify("Timeout occurred: request to " + conf.url + " took more than " + timeout / 1000 + " seconds to complete."));
      }
    });
    request.on('error', function (err) {
      reject(errorify(err, request));
    });
    if (payload) request.write(payload);
    request.end();
  });
};
},{"../constants":15,"./errorify":27,"./parse-json-dates":32,"./stream-to-callback":34,"./tiny-extend":37,"http":undefined,"https":undefined,"url":undefined}],34:[function(require,module,exports){
'use strict';

var Stream = require('stream').Transform;

module.exports = function streamToCallback(stream, cb) {
  var buf = new Stream();
  //stream.setEncoding('utf8');
  stream.on('data', function (chunk) {
    buf.push(chunk);
  });
  stream.on('error', cb);
  stream.on('end', function () {
    cb(null, buf.read());
  });
};
},{"stream":undefined}],35:[function(require,module,exports){
'use strict';

var util = require('util'),
    extend = require('./tiny-extend');

/**
 * Subclass a constructor. Like Node's `util.inherits` but lets you pass additions to the prototype, and composes constructors.
 * @param  {Function} cons  The constructor to subclass.
 * @param  {Object} proto Methods to add to the prototype.
 * @return {Function}       The new subclass.
 */
module.exports = function sub(cons, proto) {
    var child = function child() {
        cons.apply(this, arguments);
    };
    util.inherits(child, cons);
    if (proto) extend(child.prototype, proto);
    return child;
};
},{"./tiny-extend":37,"util":undefined}],36:[function(require,module,exports){
'use strict';

var _require = require('./deep-clone'),
    deepClone = _require.deepClone;

var TenantClient = void 0;
var TenantsOrPromisesById = {};

module.exports = {
  add: function add(tenant) {
    TenantsOrPromisesById[tenant.id] = tenant;
  },
  get: function get(tenantId, client, scope) {
    TenantClient = TenantClient || require('../clients/platform/tenant');
    var tenant = TenantsOrPromisesById[tenantId];
    if (tenant) {
      // may not be a promise if it was set en masse by AuthProvider.
      // AuthProvider may set hundreds of tenants at once, so we let it
      // set them directly for performance reasons.
      if (typeof tenant.then !== "function") {
        // and turn them into promises as needed.
        tenant = TenantsOrPromisesById[tenantId] = Promise.resolve(tenant);
      }
      return tenant;
    } else {
      var newClient = deepClone(client);
      if (newClient.context['user-claims']) {
        delete newClient.context['user-claims'];
      }
      if (newClient.context['jwt']) {
        delete newClient.context['jwt'];
      }
      return TenantsOrPromisesById[tenantId] = new TenantClient(newClient).getTenant(null, { scope: scope });
    }
  }
};
},{"../clients/platform/tenant":14,"./deep-clone":26}],37:[function(require,module,exports){
'use strict';

module.exports = function extend(target) {
  return Array.prototype.slice.call(arguments, 1).reduce(function (out, next) {
    if (next && typeof next !== "string") {
      Object.keys(next).forEach(function (k) {
        out[k] = next[k];
      });
    }
    return out;
  }, target);
};
},{}],38:[function(require,module,exports){
'use strict';

var path = require('path');
var fs = require('fs');

module.exports = function findup(filename) {
  var maybeFile = path.resolve(filename),
      dir = process.cwd(),
      last,
      exists;
  while (!(exists = fs.existsSync(maybeFile)) && dir !== last) {
    maybeFile = path.resolve(dir, '..', filename);
    last = dir;
    dir = path.resolve(dir, '..');
  }
  return exists && maybeFile;
};
},{"fs":undefined,"path":undefined}],39:[function(require,module,exports){
'use strict';

module.exports = {
  current: "1.1705.17038.0"
};
},{}],40:[function(require,module,exports){
'use strict';

/**
 * Node.js `XMLHttpRequest` implementation using `http.request()`.
 *
 * @module node-http-xhr
 * @author Stan Zhang <stan.zhang2@gmail.com>
 */

var url = require('url');
var http = require('http');
var https = require('https');

var NodeXHREventTarget = require('./node-xhr-event-target');

/**
 * Currently-supported response types.
 *
 * @private
 * @readonly
 * @type {Object<String, Boolean>}
 */
var supportedResponseTypes = Object.freeze({
  /** Text response (implicit) */
  '': true,
  /** Text response */
  'text': true
});

/**
 * Makes a request using either `http.request` or `https.request`, depending
 * on the value of `opts.protocol`.
 *
 * @private
 * @param {Object} opts - Options for the request.
 * @param {Function} cb - Callback for request.
 * @returns {ClientRequest} The request.
 */
function makeRequest(opts, cb) {
  if (opts.protocol === 'http:') {
    return http.request(opts, cb);
  } else if (opts.protocol === 'https:') {
    return https.request(opts, cb);
  }

  throw new Error('Unsupported protocol "' + opts.protcol + '"');
}

/**
 * Creates a new `XMLHttpRequest`.
 *
 * @classdesc A wrapper around `http.request` that attempts to emulate the
 * `XMLHttpRequest` API.
 *
 * NOTE: Currently, some features are lacking:
 * - Some ProgressAPI events (`loadstart`, `loadend`, `progress`)
 * - `responseType` values other than '' or 'text' and corresponding parsing
 *   - As a result of the above, `overrideMimeType()` isn't very useful
 * - `setRequestHeader()` doesn't check for forbidden headers.
 * - `withCredentials` is defined as an instance property, but doesn't do
 *   anything since there's no use case for CORS-like requests in `node.js`
 *   right now.
 *
 * See {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 * `XMLHttpRequest` on MDN
 * } for more details.
 *
 * @class
 * @extends module:node-xhr-event-target
 */
module.exports = function () {
  NodeXHREventTarget.call(this);

  /**
   * Current ready state.
   *
   * @private
   */
  this._readyState = this.UNSENT;

  /**
   * MIME type to use instead of the type specified by the response, or `null`
   * to use the response MIME type.
   *
   * @type {?String}
   * @private
   */
  this._mimetype = null;

  /**
   * Options for `http.request`.
   *
   * @see {@link
   * https://nodejs.org/dist/latest/docs/api/http.html
   * node.js `http` docs
   * }
   * @private
   * @type {Object}
   */
  this._reqOpts = {
    timeout: 0,
    headers: {}
  };

  /**
   * The request (instance of `http.ClientRequest`), or `null` if the request
   * hasn't been sent.
   *
   * @private
   * @type {?http.ClientRequest}
   */
  this._req = null;

  /**
   * The response (instance of `http.IncomingMessage`), or `null` if the
   * response has not arrived yet.
   *
   * @private
   * @type {?http.IncomingMessage}
   */
  this._resp = null;

  /**
   * The type of the response. Currently, only `''` and `'text'` are
   * supported, which both indicate the response should be a `String`.
   *
   * @private
   * @type {String}
   * @default ''
   */
  this._responseType = '';

  /**
   * The current response text, or `null` if the request hasn't been sent or
   * was unsuccessful.
   *
   * @private
   * @type {?String}
   */
  this._responseText = null;
};

/** @alias module:node-http-xhr */
var NodeHttpXHR = module.exports;

//
// Set up public API
//
NodeHttpXHR.prototype = Object.create(
  NodeXHREventTarget.prototype,
  /** @lends module:node-http-xhr.prototype */
  {
    /**
     * Ready state indicating the request has been created, but `open()` has not
     * been called yet.
     *
     * @type {Number}
     * @default 0
     * @readonly
     */
    UNSENT: { value: 0 },
    /**
     * Ready state indicating that `open()` has been called, but the headers
     * have not been received yet.
     *
     * @type {Number}
     * @default 1
     * @readonly
     */
    OPENED: { value: 1 },
    /**
     * Ready state indicating that `send()` has been called and the response
     * headers have been received.
     *
     * @type {Number}
     * @default 2
     * @readonly
     */
    HEADERS_RECEIVED: { value: 2 },
    /**
     * Ready state indicating that the response body is being loaded.
     *
     * @type {Number}
     * @default 3
     * @readonly
     */
    LOADING: { value: 3 },
    /**
     * Ready state indicating that the response has completed, or the request
     * was aborted/encountered an error.
     *
     * @type {Number}
     * @default 4
     * @readonly
     */
    DONE: { value: 4 },
    /**
     * The current ready state.
     *
     * @type {Number}
     * @readonly
     */
    readyState: {
      get: function getReadyState() { return this._readyState; }
    },
    /**
     * The status code for the response, or `0` if the response headers have
     * not been received yet.
     *
     * @type {Number}
     * @example 200
     * @readonly
     */
    status: {
      get: function getStatus() {
        if (!this._resp) {
          return 0;
        }

        return this._resp.statusCode;
      }
    },
    /**
     * The status text for the response, or `''` if the response headers have
     * not been received yet.
     *
     * @type {String}
     * @example 'OK'
     * @readonly
     */
    statusText: {
      get: function getStatusText() {
        if (!this._resp) {
          return '';
        }

        return this._resp.statusMessage;
      }
    },
    /**
     * The timeout for the request, in milliseconds. `0` means no timeout.
     *
     * @type {Number}
     * @default 0
     */
    timeout: {
      get: function getTimeout() { return this._reqOpts.timeout; },
      set: function setTimeout(timeout) {
        this._reqOpts.timeout = timeout;
        if (this._req) {
          this._req.setTimeout(timeout);
        }
      }
    },
    /**
     * The type of the response. Currently, only `''` and `'text'` are
     * supported, which both indicate the response should be a `String`.
     *
     * @see {@link
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
     * `XMLHttpRequest.responseType` on MDN
     * }
     *
     * @type {String}
     * @default ''
     */
    responseType: {
      get: function () { return this._responseType; },
      set: function (responseType) {
        if (!(responseType in supportedResponseTypes)) {
          return;
        }

        this._responseType = responseType;
      }
    },
    /**
     * The response, encoded according to {@link
     * module:node-http-xhr#responseType
     * `responseType`
     * }.
     *
     * If `send()` has not been called yet, this is `null`.
     *
     * If `responseType` is `''` or `'text'`, this is a `String` and will be
     * be incomplete until the response actually finishes.
     *
     * @type {?*}
     * @default ''
     * @readonly
     */
    response: {
      get: function getResponse() {
        var type = this.responseType;
        if (!(type in supportedResponseTypes)) {
          throw new Error('Unsupported responseType "' + type + '"');
        }

        return this._responseText;
      }
    },
    /**
     * The response body as a string.
     *
     * If `send()` has not been called yet, this is `null`.
     *
     * This will be incomplete until the response actually finishes.
     *
     * @type {?String}
     * @readonly
     */
    responseText: {
      get: function getResponseText() { return this._responseText; }
    },
    /**
     * Indicates whether or not cross-site `Access-Control` requests should be
     * made using credentials such as cookies, authorization headers, or TLS
     * client certificates.
     *
     * This flag doesn't do anything at the moment because there isn't much of
     * a use case for doing CORS-like requests in Node.js at the moment.
     *
     * @type {Boolean}
     * @default false
     */
    withCredentials: { value: false, writable: true }
  }
);

/**
 * Sets the ready state and emits the `readystatechange` event.
 *
 * @private
 * @param {Number} readyState - The new ready state.
 */
NodeHttpXHR.prototype._setReadyState = function (readyState) {
  this._readyState = readyState;
  this.dispatchEvent({
    type: 'readystatechange'
  });
};

/**
 * Aborts the request if it has already been sent.
 */
NodeHttpXHR.prototype.abort = function () {
  if (this.readyState === this.UNSENT || this.readyState === this.DONE) {
    return;
  }

  if (this._req) {
    this._req.abort();
  }
};

/**
 * Returns all the response headers, separated by CRLF, as a string.
 *
 * @returns {?String} The response headers, or `null` if no response yet.
 */
NodeHttpXHR.prototype.getAllResponseHeaders = function () {
  if (this.readyState < this.HEADERS_RECEIVED) {
    return null;
  }

  var headers = this._resp.headers;
  return Object.keys(headers).reduce(function (str, name) {
    return str.concat(name + ': ' + headers[name] + '\r\n');
  }, '');
};

/**
 * Returns the string containing the text of the specified header.
 *
 * @param {String} name - The header's name.
 * @returns {?String} The header's value, or `null` if no response yet or
 * the header does not exist in the response.
 */
NodeHttpXHR.prototype.getResponseHeader = function (name) {
  if (this.readyState < this.HEADERS_RECEIVED) {
    return null;
  }

  return this._resp.headers[name.toLowerCase()] || null;
};

/**
 * Initializes a request.
 *
 * @param {String} method - The HTTP method to use.
 * @param {String} reqUrl - The URL to send the request to.
 * @param {Boolean} [async=true] - Whether or not the request is asynchronous.
 */
NodeHttpXHR.prototype.open = function (method, reqUrl, async) {
  if (async === false) {
    throw new Error('Synchronous requests not implemented');
  }

  if (this._readyState > this.UNSENT) {
    this.abort();
    return;
  }

  var opts = this._reqOpts;
  opts.method = method;

  var urlObj = url.parse(reqUrl);
  ['protocol', 'hostname', 'port', 'path'].forEach(function (key) {
    if (key in urlObj) {
      opts[key] = urlObj[key];
    }
  });

  this._setReadyState(this.OPENED);
};

/**
 * Overrides the MIME type returned by the server.
 *
 * Must be called before `#send()`.
 *
 * @param {String} mimetype - The MIME type to use.
 */
NodeHttpXHR.prototype.overrideMimeType = function (mimetype) {
  if (this._req) {
    throw new Error('overrideMimeType() called after send()');
  }

  this._mimetype = mimetype;
};

/**
 * Sets the value of a request header.
 *
 * Must be called before `#send()`.
 *
 * @param {String} header - The header's name.
 * @param {String} value - The header's value.
 */
NodeHttpXHR.prototype.setRequestHeader = function (header, value) {
  if (this.readyState < this.OPENED) {
    throw new Error('setRequestHeader() called before open()');
  }

  if (this._req) {
    throw new Error('setRequestHeader() called after send()');
  }

  this._reqOpts.headers[header] = value;
};

/**
 * Sends the request.
 *
 * @param {*} [data] - The request body.
 */
NodeHttpXHR.prototype.send = function (data) {
  var onAbort = function onAbort() {
    this._setReadyState(this.DONE);

    this.dispatchEvent({
      type: 'abort'
    });
  }.bind(this);

  var opts = this._reqOpts;
  var req = makeRequest(opts, function onResponse(resp) {
    this._resp = resp;
    this._responseText = '';

    resp.setEncoding('utf8');
    resp.on('data', function onData(chunk) {
      this._responseText += chunk;

      if (this.readyState !== this.LOADING) {
        this._setReadyState(this.LOADING);
      }
    }.bind(this));

    resp.on('end', function onEnd() {
      this._setReadyState(this.DONE);
      this.dispatchEvent({
        type: 'load'
      });
    }.bind(this));

    this._setReadyState(this.HEADERS_RECEIVED);
  }.bind(this));

  // Passing `opts.timeout` doesn't actually seem to set the timeout sometimes,
  // so it is set manually here.
  req.setTimeout(opts.timeout);

  req.on('abort', onAbort);
  req.on('aborted', onAbort);

  req.on('timeout', function onTimeout() {
    this._setReadyState(this.DONE);
    this.dispatchEvent({
      type: 'timeout'
    });
  }.bind(this));

  req.on('error', function onError(err) {
    if (this._listenerCount('error') < 1) {
      // Uncaught error; throw something more meaningful
      throw err;
    }

    // Dispatch an error event. The specification does not provide for any way
    // to communicate the failure reason with the event object.
    this.dispatchEvent({
      type: 'error'
    });

    this._setReadyState(this.DONE);
  }.bind(this));

  if (data) {
    req.write(data);
  }
  req.end();

  this._req = req;
};


},{"./node-xhr-event-target":42,"http":undefined,"https":undefined,"url":undefined}],41:[function(require,module,exports){
'use strict';

/**
 * Node.js `EventTarget` implementation using Node's `EventEmitter`.
 *
 * @module node-event-target
 * @author Stan Zhang <stan.zhang2@gmail.com>
 */

var EventEmitter = require('events').EventEmitter;

/**
 * Creates a new `EventTarget`.
 *
 * @classdesc The interface implemented by objects that can receive events and
 * may have listeners for them.
 *
 * See {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
 * `EventTarget` on MDN
 * } for more details.
 *
 * @class
 */
module.exports = function () {
  EventEmitter.call(this);
};

/** @alias module:node-event-target */
var EventTarget = module.exports;

//
// Inherit some EventEmitter functions as private functions
//
['on', 'removeListener', 'emit', 'listeners'].forEach(function (key) {
  Object.defineProperty(EventTarget.prototype, '_' + key, {
    value: EventEmitter.prototype[key]
  });
});

Object.defineProperty(EventTarget.prototype, '_listenerCount', {
  value: 'listenerCount' in EventEmitter.prototype
  ? EventEmitter.prototype.listenerCount
  // Shim `EventEmitter#listenerCount` support
  : function (event) {
    return this._listeners(event).length;
  }
});

//
// Wrap the event listener methods so that the `EventEmitter` events are not
// exposed.
//

/**
 * Adds an event listener.
 *
 * @see {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * `EventTarget.addEventListener` on MDN
 * }
 * @param {String} type - The event type.
 * @param {Function} listener - The callback.
 * @param {Object} [options] - Options for the listener.
 * @param {Boolean} [options.once=false] - Invoke listener once.
 */
EventTarget.prototype.addEventListener = function (type, listener, options) {
  // Re-implement `#once()` behavior
  // This is necessary because the built-in `#once()` calls functions that we've
  // renamed on the prototype.
  var fired = false;

  /** @this NodeHttpXHR */
  function onceListener() {
    this._removeListener(type, onceListener);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  this._on(type, options && options.once
    ? onceListener
    : listener
  );
};

/**
 * Removes an event listener.
 *
 * @see {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
 * `EventTarget.removeEventListener` on MDN
 * }
 * @param {String} type - The event type.
 * @param {Function} listener - The callback.
 */
EventTarget.prototype.removeEventListener = function (type, listener) {
  this._removeListener(type, listener);
};

/**
 * Dispatches an event.
 *
 * @see {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
 * `EventTarget.dispatchEvent` on MDN
 * }
 * @param {Object} event - The event to dispatch.
 */
EventTarget.prototype.dispatchEvent = function (event) {
  event.target = this;
  this._emit(event.type, event);
};


},{"events":undefined}],42:[function(require,module,exports){
'use strict';

/**
 * Node.js `XMLHttpRequestEventTarget` implementation.
 *
 * @module node-xhr-event-target
 * @author Stan Zhang <stan.zhang2@gmail.com>
 */

var EventTarget = require('./node-event-target');

var events = [
  /**
   * The {@link
   * module:node-http-xhr#readyState
   * `readyState`
   * } changed.
   *
   * @event module:node-xhr-event-target#readystatechange
   */
  'readystatechange',
  /**
   * The request was aborted.
   *
   * @event module:node-xhr-event-target#abort
   */
  'abort',
  /**
   * An error was encountered.
   *
   * @event module:node-xhr-event-target#error
   * @type {Error}
  */
  'error',
  /**
   * The request timed out.
   *
   * @event module:node-xhr-event-target#timeout
   */
  'timeout',
  /**
   * The response finished loading.
   *
   * @event module:node-xhr-event-target#load
   */
  'load'
];

/**
 * Creates a new `XMLHttpRequestEventTarget`.
 *
 * @classdesc The interface that describes the event handlers for an
 * `XMLHttpRequest`.
 *
 * NOTE: Currently, some features are lacking:
 * - Some ProgressAPI events (`loadstart`, `loadend`, `progress`)
 *
 * See {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget
 * `XMLHttpRequestEventTarget` on MDN
 * } for more details.
 *
 * @class
 * @extends module:node-event-target
 */
module.exports = function () {
  EventTarget.call(this);

  var props = {};

  // Add private event handler properties
  events.forEach(function (type) {
    props['_on' + type] = { value: null, writable: true };
  });

  Object.defineProperties(this, props);
};

/** @alias module:node-xhr-event-target */
var NodeXHREventTarget = module.exports;

var protoProps = {};

//
// Set up event handler properties
//
events.forEach(function (type) {
  var key = 'on' + type;
  protoProps[key] = {
    get: function getHandler() { return this['_' + key]; },
    set: function setHandler(handler) {
      if (typeof handler === 'function') {
        this.addEventListener(type, handler);
        this['_' + key] = handler;
      } else {
        var old = this['_' + key];
        if (old) {
          this.removeEventListener(type, old);
        }

        this['_' + key] = null;
      }
    }
  };
});

NodeXHREventTarget.prototype = Object.create(
  EventTarget.prototype, protoProps
);


},{"./node-event-target":41}],43:[function(require,module,exports){
'use strict';

/**
 * Wrap callbacks to prevent double execution.
 *
 * @param {Function} fn Function that should only be called once.
 * @returns {Function} A wrapped callback which prevents execution.
 * @api public
 */
module.exports = function one(fn) {
  var called = 0
    , value;

  /**
   * The function that prevents double execution.
   *
   * @api private
   */
  function onetime() {
    if (called) return value;

    called = 1;
    value = fn.apply(this, arguments);
    fn = null;

    return value;
  }

  //
  // To make debugging more easy we want to use the name of the supplied
  // function. So when you look at the functions that are assigned to event
  // listeners you don't see a load of `onetime` functions but actually the
  // names of the functions that this module will call.
  //
  onetime.displayName = fn.displayName || fn.name || onetime.displayName || onetime.name;
  return onetime;
};

},{}],44:[function(require,module,exports){
module.exports = function pctEncode(regexp) {
  regexp = regexp || /\W/g;
  return function encode(string) {
    string = String(string);
    return string.replace(regexp, function (m) {
      var c = m[0].charCodeAt(0)
        , encoded = [];
      if (c < 128) {
        encoded.push(c);
      } else if ((128 <= c && c < 2048)) {
        encoded.push((c >> 6) | 192);
        encoded.push((c & 63) | 128);
      } else {
        encoded.push((c >> 12) | 224);
        encoded.push(((c >> 6) & 63) | 128);
        encoded.push((c & 63) | 128);
      }
      return encoded.map(function (c) {
        return '%' + c.toString(16).toUpperCase();
      }).join('');
    })
  }
}

},{}],45:[function(require,module,exports){
'use strict';

var Requested = require('./requested')
  , listeners = require('loads')
  , send = require('xhr-send')
  , hang = require('hang')
  , AXO = require('axo')
  , XMLHttpRequest = require('node-http-xhr');

/**
 * RequestS(tream).
 *
 * Options:
 *
 * - streaming: Should the request be streaming.
 * - method: Which HTTP method should be used.
 * - headers: Additional request headers.
 * - mode: Enable CORS mode.
 * - body: The payload for the request.
 *
 * @constructor
 * @param {String} url The URL we want to request.
 * @param {Object} options Various of request options.
 * @api public
 */
var Requests = module.exports = Requested.extend({
  constructor: function bobthebuilder(url, options) {
    if (!(this instanceof Requests)) return new Requests(url, options);

    Requested.apply(this, arguments);
  },

  /**
   * The offset of data that we've already previously read
   *
   * @type {Number}
   * @private
   */
  offset: 0,

  /**
   * The requests instance has been fully initialized.
   *
   * @param {String} url The URL we need to connect to.
   * @api private
   */
  initialize: function initialize(url) {
    this.socket = Requests[Requests.method](this);

    //
    // Open the socket BEFORE adding any properties to the instance as this might
    // trigger a thrown `InvalidStateError: An attempt was made to use an object
    // that is not, or is no longer, usable` error in FireFox:
    //
    // @see https://bugzilla.mozilla.org/show_bug.cgi?id=707484
    //
    this.socket.open(this.method.toUpperCase(), url, true);

    //
    // Register this as an active HTTP request.
    //
    Requests.active[this.id] = this;
  },

  /**
   * Initialize and start requesting the supplied resource.
   *
   * @param {Object} options Passed in defaults.
   * @api private
   */
  open: function open() {
    var what
      , slice = true
      , requests = this
      , socket = requests.socket;

    requests.on('stream', function stream(data) {
      if (!slice) {
        return requests.emit('data', data);
      }

      //
      // Please note that we need to use a method here that works on both string
      // as well as ArrayBuffer's as we have no certainty that we're receiving
      // text.
      //
      var chunk = data.slice(requests.offset);
      requests.offset = data.length;

      requests.emit('data', chunk);
    });

    requests.on('end', function cleanup() {
      delete Requests.active[requests.id];
    });

    if (this.timeout) {
      socket.timeout = +this.timeout;
    }

    if ('cors' === this.mode.toLowerCase() && 'withCredentials' in socket) {
      socket.withCredentials = true;
    }

    //
    // ActiveXObject will throw an `Type Mismatch` exception when setting the to
    // an null-value and to be consistent with all XHR implementations we're going
    // to cast the value to a string.
    //
    // While we don't technically support the XDomainRequest of IE, we do want to
    // double check that the setRequestHeader is available before adding headers.
    //
    // Chrome has a bug where it will actually append values to the header instead
    // of overriding it. So if you do a double setRequestHeader(Content-Type) with
    // text/plain and with text/plain again, it will end up as `text/plain,
    // text/plain` as header value. This is why use a headers object as it
    // already eliminates duplicate headers.
    //
    for (what in this.headers) {
      if (this.headers[what] !== undefined && this.socket.setRequestHeader) {
        this.socket.setRequestHeader(what, this.headers[what] +'');
      }
    }

    //
    // Set the correct responseType method.
    //
    if (requests.streaming) {
      if (!this.body || 'string' === typeof this.body) {
        if ('multipart' in socket) {
          socket.multipart = true;
          slice = false;
        } else if (Requests.type.mozchunkedtext) {
          socket.responseType = 'moz-chunked-text';
          slice = false;
        }
      } else {
        if (Requests.type.mozchunkedarraybuffer) {
          socket.responseType = 'moz-chunked-arraybuffer';
        } else if (Requests.type.msstream) {
          socket.responseType = 'ms-stream';
        }
      }
    }

    listeners(socket, requests, requests.streaming);
    requests.emit('before', socket);

    send(socket, this.body, hang(function send(err) {
      if (err) {
        requests.emit('error', err);
        requests.emit('end', err);
      }

      requests.emit('send');
    }));
  },

  /**
   * Completely destroy the running XHR and release of the internal references.
   *
   * @returns {Boolean} Successful destruction
   * @api public
   */
  destroy: function destroy() {
    if (!this.socket) return false;

    this.emit('destroy');

    this.socket.abort();
    this.removeAllListeners();

    this.headers = {};
    this.socket = null;
    this.body = null;

    delete Requests.active[this.id];

    return true;
  }
});

/**
 * Create a new XMLHttpRequest.
 *
 * @returns {XMLHttpRequest}
 * @api private
 */
Requests.XHR = function create() {
  try { return new XMLHttpRequest(); }
  catch (e) {}
};

/**
 * Create a new ActiveXObject which can be used for XHR.
 *
 * @returns {ActiveXObject}
 * @api private
 */
Requests.AXO = function create() {
  var ids = ['MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.3.0', 'Microsoft.XMLHTTP']
    , id;

  while (ids.length) {
    id = ids.shift();

    try { return new AXO(id); }
    catch (e) {}
  }
};

/**
 * Requests that are currently running.
 *
 * @type {Object}
 * @private
 */
Requests.active = {};

/**
 * The type of technology we are using to establish a working Ajax connection.
 * This can either be:
 *
 * - XHR: XMLHttpRequest
 * - AXO: ActiveXObject
 *
 * This is also used as internal optimization so we can easily get the correct
 * constructor as we've already feature detected it.
 *
 * @type {String}
 * @public
 */
Requests.method = !!Requests.XHR() ? 'XHR' : (!!Requests.AXO() ? 'AXO' : '');

/**
 * Boolean indicating
 *
 * @type {Boolean}
 * @public
 */
Requests.supported = !!Requests.method;

/**
 * The different type of `responseType` parsers that are supported in this XHR
 * implementation.
 *
 * @type {Object}
 * @public
 */
Requests.type = 'XHR' === Requests.method ? (function detect() {
  var types = 'arraybuffer,blob,document,json,text,moz-blob,moz-chunked-text,moz-chunked-arraybuffer,ms-stream'.split(',')
    , supported = {}
    , type, xhr, prop;

  while (types.length) {
    type = types.pop();
    prop = type.replace(/-/g, '');
    xhr = Requests.XHR();

    //
    // Older versions of Firefox/IE11 will throw an error because previous
    // version of the specification do not support setting `responseType`
    // before the request is opened. Thus, we open the request here.
    //
    // Note that `open()` does not actually open any connections; it just
    // initializes the request object.
    //
    try {
      // Try opening a request to current page.
      xhr.open('get', '/', true);
    } catch (e) {
      // In JSDOM the above will fail because it only supports full URLs, so
      // try opening a request to localhost.
      try {
        xhr.open('get', 'http://localhost/', true);
      } catch (err) {
        supported[prop] = false;
        continue;
      }
    }

    try {
      xhr.responseType = type;
      supported[prop] = 'response' in xhr && xhr.responseType === type;
    } catch (e) {
      supported[prop] = false;
    }

    xhr = null;
  }

  return supported;
}()) : {};

/**
 * Do we support streaming response parsing.
 *
 * @type {Boolean}
 * @private
 */
Requests.streaming = 'XHR' === Requests.method && (
     'multipart' in XMLHttpRequest.prototype
  || Requests.type.mozchunkedarraybuffer
  || Requests.type.mozchunkedtext
  || Requests.type.msstream
  || Requests.type.mozblob
);

//
// IE has a bug which causes IE10 to freeze when close WebPage during an XHR
// request: https://support.microsoft.com/kb/2856746
//
// The solution is to completely clean up all active running requests.
//
if (global.attachEvent) global.attachEvent('onunload', function reap() {
  for (var id in Requests.active) {
    Requests.active[id].destroy();
  }
});

//
// Expose the Requests library.
//
module.exports = Requests;

},{"./requested":46,"axo":4,"hang":8,"loads":9,"node-http-xhr":40,"xhr-send":51}],46:[function(require,module,exports){
'use strict';

var EventEmitter = require('eventemitter3');

function Requested(url, options) {
  EventEmitter.call(this);

  //
  // All properties/options that should be introduced on the prototype.
  //
  this.merge(this, Requested.defaults, options || {});

  //
  // Private properties that should not be overridden by developers.
  //
  this.id = ++Requested.requested;

  //
  // We want to implement a stream like interface on top of this module so it
  // can be used to read streaming data in node as well as through browserify.
  //
  this.readable = true;
  this.writable = false;

  if (this.initialize) this.initialize(url);
  if (!this.manual && this.open) this.open(url);
}

Requested.extend = require('extendible');
Requested.prototype = new EventEmitter();
Requested.prototype.constructor = Requested;


/**
 * Accurate type discovery.
 *
 * @param {Mixed} what What ever needs to be figured out.
 * @returns {String} Name of the type.
 * @api private
 */
Requested.prototype.typeof = function type(what) {
  return Object.prototype.toString.call(what).slice(8, -1).toLowerCase();
};

/**
 * Deeply assign and merge objects together.
 *
 * @param {Object} target The target object that should receive the merged data.
 * @returns {Object} The merged target object.
 * @api private
 */
Requested.prototype.merge = function merge(target) {
  var i = 1
    , arg, key;

  for (; i < arguments.length; i++) {
    arg = arguments[i];

    for (key in arg) {
      if (!Object.prototype.hasOwnProperty.call(arg, key)) continue;

      if ('object' === this.typeof(arg[key])) {
        target[key] = this.merge('object' === this.typeof(target[key]) ? target[key] : {}, arg[key]);
      } else {
        target[key] = arg[key];
      }
    }
  }

  return target;
};

/**
 * The defaults for the Requests. These values will be used if no options object
 * or matching key is provided. It can be override globally if needed but this
 * is not advised as it can have some potential side affects for other libraries
 * that use this module.
 *
 * @type {Object}
 * @public
 */
Requested.defaults = {
  streaming: false,
  manual: false,
  method: 'GET',
  mode: 'cors',
  headers: {
    //
    // We're forcing text/plain mode by default to ensure that regular
    // requests can benefit from CORS requests without an OPTIONS request. It's
    // shared between server and client implementations to ensure that requests
    // are handled in exactly the same way.
    //
    'Content-Type': 'text/plain'
  }
};

/**
 * Unique id and also an indication on how many XHR requests we've made using
 * this library.
 *
 * @type {Number}
 * @private
 */
Requested.requested = 0;

//
// Expose the module interface.
//
module.exports = Requested;

},{"eventemitter3":5,"extendible":6}],47:[function(require,module,exports){
module.exports = (function(){
  /*
   * Generated by PEG.js 0.7.0.
   *
   * http://pegjs.majda.cz/
   */
  
  function quote(s) {
    /*
     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
     * string literal except for the closing quote character, backslash,
     * carriage return, line separator, paragraph separator, and line feed.
     * Any character may appear in the form of an escape sequence.
     *
     * For portability, we also escape escape all control and non-ASCII
     * characters. Note that "\0" and "\v" escape sequences are not used
     * because JSHint does not like the first and IE the second.
     */
     return '"' + s
      .replace(/\\/g, '\\\\')  // backslash
      .replace(/"/g, '\\"')    // closing quote character
      .replace(/\x08/g, '\\b') // backspace
      .replace(/\t/g, '\\t')   // horizontal tab
      .replace(/\n/g, '\\n')   // line feed
      .replace(/\f/g, '\\f')   // form feed
      .replace(/\r/g, '\\r')   // carriage return
      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
      + '"';
  }
  
  var result = {
    /*
     * Parses the input with a generated parser. If the parsing is successfull,
     * returns a value explicitly or implicitly specified by the grammar from
     * which the parser was generated (see |PEG.buildParser|). If the parsing is
     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
     */
    parse: function(input, startRule) {
      var parseFunctions = {
        "uriTemplate": parse_uriTemplate,
        "expression": parse_expression,
        "op": parse_op,
        "pathExpression": parse_pathExpression,
        "paramList": parse_paramList,
        "param": parse_param,
        "cut": parse_cut,
        "listMarker": parse_listMarker,
        "substr": parse_substr,
        "nonexpression": parse_nonexpression,
        "extension": parse_extension
      };
      
      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "uriTemplate";
      }
      
      var pos = 0;
      var reportFailures = 0;
      var rightmostFailuresPos = 0;
      var rightmostFailuresExpected = [];
      
      function padLeft(input, padding, length) {
        var result = input;
        
        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }
        
        return result;
      }
      
      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        var escapeChar;
        var length;
        
        if (charCode <= 0xFF) {
          escapeChar = 'x';
          length = 2;
        } else {
          escapeChar = 'u';
          length = 4;
        }
        
        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }
      
      function matchFailed(failure) {
        if (pos < rightmostFailuresPos) {
          return;
        }
        
        if (pos > rightmostFailuresPos) {
          rightmostFailuresPos = pos;
          rightmostFailuresExpected = [];
        }
        
        rightmostFailuresExpected.push(failure);
      }
      
      function parse_uriTemplate() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result0 = [];
        result1 = parse_nonexpression();
        if (result1 === null) {
          result1 = parse_expression();
        }
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_nonexpression();
          if (result1 === null) {
            result1 = parse_expression();
          }
        }
        if (result0 !== null) {
          result0 = (function(offset, pieces) { return new Template(pieces) })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_expression() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 123) {
          result0 = "{";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"{\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_op();
          if (result1 !== null) {
            result2 = parse_paramList();
            if (result2 !== null) {
              if (input.charCodeAt(pos) === 125) {
                result3 = "}";
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\"}\"");
                }
              }
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, op, params) { return expression(op, params) })(pos0, result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_op() {
        var result0;
        
        if (/^[\/;:.?&+#]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[\\/;:.?&+#]");
          }
        }
        if (result0 === null) {
          result0 = "";
        }
        return result0;
      }
      
      function parse_pathExpression() {
        var result0;
        
        if (input.substr(pos, 2) === "{/") {
          result0 = "{/";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"{/\"");
          }
        }
        return result0;
      }
      
      function parse_paramList() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2, pos3;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_param();
        if (result0 !== null) {
          result1 = [];
          pos2 = pos;
          pos3 = pos;
          if (input.charCodeAt(pos) === 44) {
            result2 = ",";
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\",\"");
            }
          }
          if (result2 !== null) {
            result3 = parse_param();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos3;
            }
          } else {
            result2 = null;
            pos = pos3;
          }
          if (result2 !== null) {
            result2 = (function(offset, p) { return p; })(pos2, result2[1]);
          }
          if (result2 === null) {
            pos = pos2;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos2 = pos;
            pos3 = pos;
            if (input.charCodeAt(pos) === 44) {
              result2 = ",";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\",\"");
              }
            }
            if (result2 !== null) {
              result3 = parse_param();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos3;
              }
            } else {
              result2 = null;
              pos = pos3;
            }
            if (result2 !== null) {
              result2 = (function(offset, p) { return p; })(pos2, result2[1]);
            }
            if (result2 === null) {
              pos = pos2;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, hd, rst) { rst.unshift(hd); return rst; })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_param() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = [];
        if (/^[a-zA-Z0-9_.%]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[a-zA-Z0-9_.%]");
          }
        }
        while (result1 !== null) {
          result0.push(result1);
          if (/^[a-zA-Z0-9_.%]/.test(input.charAt(pos))) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("[a-zA-Z0-9_.%]");
            }
          }
        }
        if (result0 !== null) {
          result1 = parse_cut();
          if (result1 === null) {
            result1 = parse_listMarker();
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result2 = parse_extension();
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars, clm, e) { clm = clm || {};
              return {
              name: chars.join(''),
              explode: clm.listMarker,
              cut: clm.cut,
              extended: e
            } })(pos0, result0[0], result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_cut() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_substr();
        if (result0 !== null) {
          result0 = (function(offset, cut) { return {cut: cut}; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_listMarker() {
        var result0;
        var pos0;
        
        pos0 = pos;
        if (input.charCodeAt(pos) === 42) {
          result0 = "*";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"*\"");
          }
        }
        if (result0 !== null) {
          result0 = (function(offset, listMarker) { return {listMarker: listMarker}; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_substr() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 58) {
          result0 = ":";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\":\"");
          }
        }
        if (result0 !== null) {
          if (/^[0-9]/.test(input.charAt(pos))) {
            result2 = input.charAt(pos);
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("[0-9]");
            }
          }
          if (result2 !== null) {
            result1 = [];
            while (result2 !== null) {
              result1.push(result2);
              if (/^[0-9]/.test(input.charAt(pos))) {
                result2 = input.charAt(pos);
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("[0-9]");
                }
              }
            }
          } else {
            result1 = null;
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, digits) { return parseInt(digits.join('')) })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_nonexpression() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        if (/^[^{]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[^{]");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[^{]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[^{]");
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { return chars.join(''); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_extension() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 40) {
          result0 = "(";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"(\"");
          }
        }
        if (result0 !== null) {
          if (/^[^)]/.test(input.charAt(pos))) {
            result2 = input.charAt(pos);
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("[^)]");
            }
          }
          if (result2 !== null) {
            result1 = [];
            while (result2 !== null) {
              result1.push(result2);
              if (/^[^)]/.test(input.charAt(pos))) {
                result2 = input.charAt(pos);
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("[^)]");
                }
              }
            }
          } else {
            result1 = null;
          }
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 41) {
              result2 = ")";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\")\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { return chars.join('') })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      
      function cleanupExpected(expected) {
        expected.sort();
        
        var lastExpected = null;
        var cleanExpected = [];
        for (var i = 0; i < expected.length; i++) {
          if (expected[i] !== lastExpected) {
            cleanExpected.push(expected[i]);
            lastExpected = expected[i];
          }
        }
        return cleanExpected;
      }
      
      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */
        
        var line = 1;
        var column = 1;
        var seenCR = false;
        
        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
          var ch = input.charAt(i);
          if (ch === "\n") {
            if (!seenCR) { line++; }
            column = 1;
            seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }
        
        return { line: line, column: column };
      }
      
      
          var cls = require('./lib/classes')
          var Template = cls.Template
          var expression = cls.expression
      
      
      var result = parseFunctions[startRule]();
      
      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var offset = Math.max(pos, rightmostFailuresPos);
        var found = offset < input.length ? input.charAt(offset) : null;
        var errorPosition = computeErrorPosition();
        
        throw new this.SyntaxError(
          cleanupExpected(rightmostFailuresExpected),
          found,
          offset,
          errorPosition.line,
          errorPosition.column
        );
      }
      
      return result;
    },
    
    /* Returns the parser source code. */
    toSource: function() { return this._source; }
  };
  
  /* Thrown when a parser encounters a syntax error. */
  
  result.SyntaxError = function(expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      var expectedHumanized, foundHumanized;
      
      switch (expected.length) {
        case 0:
          expectedHumanized = "end of input";
          break;
        case 1:
          expectedHumanized = expected[0];
          break;
        default:
          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
            + " or "
            + expected[expected.length - 1];
      }
      
      foundHumanized = found ? quote(found) : "end of input";
      
      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
    }
    
    this.name = "SyntaxError";
    this.expected = expected;
    this.found = found;
    this.message = buildMessage(expected, found);
    this.offset = offset;
    this.line = line;
    this.column = column;
  };
  
  result.SyntaxError.prototype = Error.prototype;
  
  return result;
})();

},{"./lib/classes":48}],48:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var FormContinuationExpression, FormStartExpression, FragmentExpression, LabelExpression, NamedExpression, PathParamExpression, PathSegmentExpression, ReservedExpression, SimpleExpression, Template, encoders, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  encoders = require('./encoders');

  Template = Template = (function() {
    function Template(pieces) {
      /*
      :param pieces: An array of strings and expressions in the order they appear in the template.
      */

      var i,
        _this = this;
      this.expressions = [];
      this.prefix = 'string' === typeof pieces[0] ? pieces.shift() : '';
      i = 0;
      pieces.forEach(function(p) {
        switch (typeof p) {
          case 'object':
            return _this.expressions[i++] = p;
          case 'string':
            return _this.expressions[i - 1].suffix = p;
        }
      });
    }

    Template.prototype.expand = function(vars) {
      return this.prefix + this.expressions.map(function(expr) {
        return expr.expand(vars);
      }).join('');
    };

    Template.prototype.toString = function() {
      return this.prefix + this.expressions.join('');
    };

    Template.prototype.toJSON = function() {
      return this.toString();
    };

    return Template;

  })();

  SimpleExpression = (function() {
    var definedPairs;

    SimpleExpression.prototype.first = "";

    SimpleExpression.prototype.sep = ",";

    SimpleExpression.prototype.named = false;

    SimpleExpression.prototype.empty = "";

    SimpleExpression.prototype.allow = "U";

    function SimpleExpression(params) {
      this.params = params;
      this.explodeObject = __bind(this.explodeObject, this);
      this.explodeArray = __bind(this.explodeArray, this);
      this._expandPair = __bind(this._expandPair, this);
      this.stringifySingle = __bind(this.stringifySingle, this);
      this.encode = __bind(this.encode, this);
      if (this.params == null) {
        this.params = [];
      }
      this.suffix = '';
    }

    SimpleExpression.prototype.encode = function(string) {
      /*
      Encode a string value for the URI
      */

      return encoders[this.allow](string);
    };

    SimpleExpression.prototype.stringifySingle = function(param, value) {
      /*
      Encode a single value as a string
      */

      var k, type, v;
      type = typeof value;
      if (type === 'string' || type === 'boolean' || type === 'number') {
        value = value.toString();
        return this.encode(value.substring(0, param.cut || value.length));
      } else if (Array.isArray(value)) {
        if (param.cut) {
          throw new Error("Prefixed Values do not support lists. Check " + param.name);
        }
        return value.map(this.encode).join(',');
      } else {
        if (param.cut) {
          throw new Error("Prefixed Values do not support maps. Check " + param.name);
        }
        return ((function() {
          var _results;
          _results = [];
          for (k in value) {
            v = value[k];
            _results.push([k, v].map(this.encode).join(','));
          }
          return _results;
        }).call(this)).join(',');
      }
    };

    SimpleExpression.prototype.expand = function(vars) {
      var defined, expanded,
        _this = this;
      defined = definedPairs(this.params, vars);
      expanded = defined.map(function(pair) {
        return _this._expandPair.apply(_this, pair);
      }).join(this.sep);
      if (expanded) {
        return this.first + expanded + this.suffix;
      } else {
        if (this.empty && defined.length) {
          return this.empty + this.suffix;
        } else {
          return this.suffix;
        }
      }
    };

    definedPairs = function(params, vars) {
      /*
      Return an array of [key, value] arrays where ``key`` is a parameter name
      from ``@params`` and ``value`` is the value from vars, when ``value`` is
      neither undefined nor an empty collection.
      */

      var _this = this;
      return params.map(function(p) {
        return [p, vars[p.name]];
      }).filter(function(pair) {
        var k, v, vv;
        v = pair[1];
        switch (typeof v) {
          case "undefined":
            return false;
          case "object":
            if (Array.isArray(v)) {
              v.length > 0;
            }
            for (k in v) {
              vv = v[k];
              if (vv) {
                return true;
              }
            }
            return false;
          default:
            return true;
        }
      });
    };

    SimpleExpression.prototype._expandPair = function(param, value) {
      /*
      Return the expanded string form of ``pair``.
      
      :param pair: A ``[param, value]`` tuple.
      */

      var name;
      name = param.name;
      if (param.explode) {
        if (Array.isArray(value)) {
          return this.explodeArray(param, value);
        } else if (typeof value === 'string') {
          return this.stringifySingle(param, value);
        } else {
          return this.explodeObject(value);
        }
      } else {
        return this.stringifySingle(param, value);
      }
    };

    SimpleExpression.prototype.explodeArray = function(param, array) {
      return array.map(this.encode).join(this.sep);
    };

    SimpleExpression.prototype.explodeObject = function(object) {
      var k, pairs, v, vv, _i, _len;
      pairs = [];
      for (k in object) {
        v = object[k];
        k = this.encode(k);
        if (Array.isArray(v)) {
          for (_i = 0, _len = v.length; _i < _len; _i++) {
            vv = v[_i];
            pairs.push([k, this.encode(vv)]);
          }
        } else {
          pairs.push([k, this.encode(v)]);
        }
      }
      return pairs.map(function(pair) {
        return pair.join('=');
      }).join(this.sep);
    };

    SimpleExpression.prototype.toString = function() {
      var params;
      params = this.params.map(function(p) {
        return p.name + p.explode;
      }).join(',');
      return "{" + this.first + params + "}" + this.suffix;
    };

    SimpleExpression.prototype.toJSON = function() {
      return this.toString();
    };

    return SimpleExpression;

  })();

  NamedExpression = (function(_super) {
    __extends(NamedExpression, _super);

    function NamedExpression() {
      this.explodeArray = __bind(this.explodeArray, this);
      this.stringifySingle = __bind(this.stringifySingle, this);
      _ref = NamedExpression.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /*
    A NamedExpression uses name=value expansions in most cases
    */


    NamedExpression.prototype.stringifySingle = function(param, value) {
      value = (value = NamedExpression.__super__.stringifySingle.apply(this, arguments)) ? "=" + value : this.empty;
      return "" + param.name + value;
    };

    NamedExpression.prototype.explodeArray = function(param, array) {
      var _this = this;
      return array.map(function(v) {
        return "" + param.name + "=" + (_this.encode(v));
      }).join(this.sep);
    };

    return NamedExpression;

  })(SimpleExpression);

  ReservedExpression = (function(_super) {
    __extends(ReservedExpression, _super);

    function ReservedExpression() {
      _ref1 = ReservedExpression.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ReservedExpression.prototype.encode = function(string) {
      return encoders['U+R'](string);
    };

    ReservedExpression.prototype.toString = function() {
      return '{+' + (ReservedExpression.__super__.toString.apply(this, arguments)).substring(1);
    };

    return ReservedExpression;

  })(SimpleExpression);

  FragmentExpression = (function(_super) {
    __extends(FragmentExpression, _super);

    function FragmentExpression() {
      _ref2 = FragmentExpression.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    FragmentExpression.prototype.first = '#';

    FragmentExpression.prototype.empty = '#';

    FragmentExpression.prototype.encode = function(string) {
      return encoders['U+R'](string);
    };

    return FragmentExpression;

  })(SimpleExpression);

  LabelExpression = (function(_super) {
    __extends(LabelExpression, _super);

    function LabelExpression() {
      _ref3 = LabelExpression.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    LabelExpression.prototype.first = '.';

    LabelExpression.prototype.sep = '.';

    LabelExpression.prototype.empty = '.';

    return LabelExpression;

  })(SimpleExpression);

  PathSegmentExpression = (function(_super) {
    __extends(PathSegmentExpression, _super);

    function PathSegmentExpression() {
      _ref4 = PathSegmentExpression.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    PathSegmentExpression.prototype.first = '/';

    PathSegmentExpression.prototype.sep = '/';

    return PathSegmentExpression;

  })(SimpleExpression);

  PathParamExpression = (function(_super) {
    __extends(PathParamExpression, _super);

    function PathParamExpression() {
      _ref5 = PathParamExpression.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    PathParamExpression.prototype.first = ';';

    PathParamExpression.prototype.sep = ';';

    return PathParamExpression;

  })(NamedExpression);

  FormStartExpression = (function(_super) {
    __extends(FormStartExpression, _super);

    function FormStartExpression() {
      _ref6 = FormStartExpression.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    FormStartExpression.prototype.first = '?';

    FormStartExpression.prototype.sep = '&';

    FormStartExpression.prototype.empty = '=';

    return FormStartExpression;

  })(NamedExpression);

  FormContinuationExpression = (function(_super) {
    __extends(FormContinuationExpression, _super);

    function FormContinuationExpression() {
      _ref7 = FormContinuationExpression.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    FormContinuationExpression.prototype.first = '&';

    return FormContinuationExpression;

  })(FormStartExpression);

  module.exports = {
    Template: Template,
    SimpleExpression: SimpleExpression,
    NamedExpression: NamedExpression,
    ReservedExpression: ReservedExpression,
    FragmentExpression: FragmentExpression,
    LabelExpression: LabelExpression,
    PathSegmentExpression: PathSegmentExpression,
    PathParamExpression: PathParamExpression,
    FormStartExpression: FormStartExpression,
    FormContinuationExpression: FormContinuationExpression,
    expression: function(op, params) {
      var cls;
      cls = (function() {
        switch (op) {
          case '':
            return SimpleExpression;
          case '+':
            return ReservedExpression;
          case '#':
            return FragmentExpression;
          case '.':
            return LabelExpression;
          case '/':
            return PathSegmentExpression;
          case ';':
            return PathParamExpression;
          case '?':
            return FormStartExpression;
          case '&':
            return FormContinuationExpression;
        }
      })();
      return new cls(params);
    }
  };

}).call(this);

},{"./encoders":49}],49:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var pctEncode;

  pctEncode = require('pct-encode');

  exports["U"] = pctEncode(/[^\w~.-]/g);

  exports["U+R"] = pctEncode(/[^\w.~:\/\?#\[\]@!\$&'()*+,;=%-]|%(?!\d\d)/g);

}).call(this);

},{"pct-encode":44}],50:[function(require,module,exports){
'use strict';

/**
 * Safely access the response body.
 *
 * @param {XHR} xhr XHR request who's body we need to safely extract.
 * @returns {Mixed} The response body.
 * @api public
 */
module.exports = function get(xhr) {
  if (xhr.response) return xhr.response;

  var type = xhr.responseType || '';

  //
  // Browser bugs:
  //
  // IE<10:   Accessing binary data's responseText will throw an Exception
  // Chrome:  When responseType is set to Blob it will throw errors even when
  //          Accessing the responseText property.
  //
  // Firefox: An error is thrown when reading the `responseText` after unload
  //          when responseType is using a `moz-chunked-*` type.
  //          https://bugzilla.mozilla.org/show_bug.cgi?id=687087
  //
  if (~type.indexOf('moz-chunked') && xhr.readyState === 4) return;
  if ('blob' !== type && 'string' === typeof xhr.responseText) {
    return xhr.responseText || xhr.responseXML;
  }
};

},{}],51:[function(require,module,exports){
'use strict';

/**
 * Safely send data over XHR.
 *
 * @param {XHR} xhr The XHR object that we should send.
 * @param {Mixed} data The data that needs to be send.
 * @param {Function} fn Send callback.
 * @returns {Boolean} Successful sending
 * @api public
 */
module.exports = function send(xhr, data, fn) {
  //
  // @TODO detect binary data.
  // @TODO polyfill sendAsBinary (firefoxy only)?
  //
  try { xhr.send(data); }
  catch (e) { return fn(e), false; }

  //
  // Call the completion callback __after__ the try catch to prevent unwanted
  // and extended try wrapping.
  //
  return fn(), true;
};

},{}],52:[function(require,module,exports){
'use strict';

/**
 * Get the correct status code for a given XHR request.
 *
 * @param {XHR} xhr A XHR request who's status code needs to be retrieved.
 * @returns {Object}
 * @api public
 */
module.exports = function status(xhr) {
  var local = /^file:/.test(xhr.responseURL)
    , code = xhr.status
    , text = '';

  //
  // Older version IE incorrectly return status code 1233 for requests that
  // respond with a 204 header.
  //
  // @see http://stackoverflow.com/q/10046972
  //
  if (1233 === code) return {
    error: false,
    text: 'OK',
    code: 204
  };

  //
  // If you make a request with a file:// protocol it returns status code 0 by
  // default so we're going to assume 200 instead. But if you do a HTTP request
  // to dead server you will also get the same 0 response code in chrome. So
  // we're going to assume statusCode 200 for local files.
  //
  if (0 === code) return local ? {
    error: false,
    text: 'OK',
    code: 200
  } : {
    error: true,
    text: 'An unknown error occured',
    code: 0
  };

  //
  // FireFox will throw an error when accessing the statusText on faulty
  // cross-domain requests.
  //
  try { text = xhr.statusText; }
  catch (e) {}

  return {
    error: code >= 400,
    text: text,
    code: code
  };
};

},{}]},{},[3])(3)
});
