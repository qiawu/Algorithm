/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

// object.watch
if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
        enumerable: false
        , configurable: true
        , writable: false
        , value: function (prop, handler) {
            var
                oldval = this[prop]
                , newval = oldval
                , getter = function () {
                    return newval;
                }
                , setter = function (val) {
                    oldval = newval;
                    return newval = handler.call(this, this, prop, oldval, val);
                }
                ;

            if (delete this[prop]) {     // can't watch constants
                Object.defineProperty(this, prop, {
                    get: getter
                    , set: setter
                    , enumerable: true
                    , configurable: true
                });
            }
        }
    });
}

// object.unwatch
if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
        enumerable: false
        , configurable: true
        , writable: false
        , value: function (prop) {
            var val = this[prop];
            delete this[prop];          // remove accessors
            this[prop] = val;
        }
    });
}

function watchAll(obj, handler) {

    for (var prop in obj) {             //for each attribute if obj is an object
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            obj.watch(prop, handler);
        }
    }
};

function unwatchAll(obj) {

    for (var prop in obj) { //for each attribute if obj is an object
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            obj.unwatch(prop);
        }
    }
};

function startWatch(id, obj, handler) {
    function defaultHandler(curObj, prop, oldval, newval) {
        console.log("watch " + id + ": " + JSON.stringify(curObj));
        return newval;
    }
    if(handler === undefined) handler = defaultHandler;
    watchAll(obj, handler);
}


function endWatch(obj) {
    // trigger the handler to print the latest object value
    for (var prop in obj) {
        obj[prop] = obj[prop];
        break;
    }
    unwatchAll(obj);
}