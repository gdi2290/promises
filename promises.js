var Promises = function() {
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
        throw new Error('can\'t transition to same state: ' + state);
      }

      // trying to change out of fulfilled or rejected
      if (this.state === State._FULFILLED || this.state === State._REJECTED) {
        throw new Error('can\'t transition from current state: ' + state);
      }

      // if second argument is't given at all (passing undefined allowed)
      if (state === State._FULFILLED && arguments.length < 2) {
        throw new Error('transition to fulfilled must have a non \'null\' value');
      }

      // if  null reason is passed in
      if (state === State._REJECTED && value === null) {
        throw new Error('transition to rejected must have a non \'null\' reason');
      }

      // change state
      this.state = state;
      this.value = value;
      return this.state;
    },
    then: function(onFulfilled, onRejected) {

      // initialize array for cache
      this.cache = this.cache || [];

      var promise = Object.create(Promises);

      this.cache.push({
        fulfill: onFulfilled,
        reject:  onRejected,
        promise: promise
      });

      // chaining promises
      return promise;
    },
    resolve: function() {

      // check state if pending state
      if (this.state === State._PENDING) {
        return false;
      }

    }


  };

};
