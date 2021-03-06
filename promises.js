var Promises = function() {
  'use strict';

  // promises state
  var State = {
    _PENDING:   0,
    _FULFILLED: 1,
    _REJECTED:  2
  };

  var Promises = {
    state: State._PENDING,
    changeState: function(state, value)  {

      // catch changing to state (perhaps trying to change value)
      if (this.state === state) {
        return new Error('can\'t transition to same state: ' + state);
      }

      // trying to change out of fulfilled or rejected
      if (this.state === State._FULFILLED || this.state === State._REJECTED) {
        return new Error('can\'t transition from current state: ' + state);
      }

      // if the second argument is't given at all (passing undefined allowed)
      if (state === State._FULFILLED && arguments.length < 2) {
        return new Error('transition to fulfilled must have a non \'null\' value');
      }

      // if a null reason is passed in
      if (state === State._REJECTED && arguments.length < 2) {
        return new Error('transition to rejected must have a non \'null\' reason');
      }

      // change state
      this.state = state;
      this.value = value;
      this.resolve();

      return this.state;
    },
    async: function(fn) {
      setTimeout(fn, 5);
    },
    fulfill: function(value) {
      this.changeState(State._FULFILLED, value);
    },
    reject: function(reason) {
      this.changeState(State._REJECTED, reason);
    },
    then: function(onFulfilled, onRejected) {
      var promise = Object.create(Promises),
          self    = this;

      // initialize array for cache
      self.cache = self.cache || [];

      this.async(function() {
        self.cache.push({
          fulfill: onFulfilled,
          reject:  onRejected,
          promise: promise
        });
        self.resolve();
      });

      // chaining promises
      return promise;
    },
    resolve: function() {

      // check state if pending state
      if (this.state === State._PENDING) {
        return false;
      }

      // for each 'then'
      while (this.cache && this.cache.length) {
        var obj = this.cache.shift();

        // get the function based on state
        var fn = (this.state === State._FULFILLED) ?
                                       obj.fulfill :
                                        obj.reject;

        if (typeof fn !== 'function') {
          obj.promise.changeState(this.state, this.value);
        } else {

          // fulfill promise with a value or reject with an error
          try {

            var value = fn(this.value);

            // deal with promise returned
            if (value && typeof value.then === 'function') {
              value.then(function(value) {
                obj.promise.changeState(State._FULFILLED, value);
              }, function(reason) {
                obj.promise.changeState(State._REJECTED, error);
              });

            // deal with other value returned
            } else {
              obj.promise.changeState(State._FULFILLED, value);
            } // end if promise is returned

          // deal with error thrown
          } catch (error) {
            obj.promise.changeState(State._REJECTED, error);
          }

        } // end else typeof 'function'

      } // end while this.cache

    } // end resolve method
  }; // end Promises


  return Object.create(Promises);
};
