/*jshint eqeqeq:false */
(function(window) {
  "use strict";

  /**
   * Creates a new client side storage object and will create an empty
   * collection if no collection already exists.
   *
   * @param {string} name The name of our DB we want to use
   * @param {function} callback Our fake DB uses callbacks because in
   * real life you probably would be making AJAX calls
   */
  function Store(name, callback) {
    callback = callback || function() {};

    this._dbName = name;

    if (!localStorage[name]) {
      var data = {
        todos: []
      };

      localStorage[name] = JSON.stringify(data);
    }

    callback.call(this, JSON.parse(localStorage[name]));
  }

  /**
   * Finds items based on a query given as a JS object
   *
   * @param {object} query The query to match against (i.e. {foo: 'bar'})
   * @param {function} callback	 The callback to fire when the query has
   * completed running
   *
   * @example
   * db.find({foo: 'bar', hello: 'world'}, function (data) {
   *	 // data will return any items that have foo: bar and
   *	 // hello: world in their properties
   * });
   */
  Store.prototype.find = function(query, callback) {
    if (!callback) {
      return;
    }

    var todos = JSON.parse(localStorage[this._dbName]).todos;

    callback.call(
      this,
      todos.filter(function(todo) {
        for (var q in query) {
          if (query[q] !== todo[q]) {
            return false;
          }
        }
        return true;
      })
    );
  };

  /**
   * Will retrieve all data from the collection
   *
   * @param {function} callback The callback to fire upon retrieving data
   */
  Store.prototype.findAll = function(callback) {
    callback = callback || function() {};
    callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
  };

  /**
   * Will save the given data to the DB. If no item exists it will create a new
   * item, otherwise it'll simply update an existing item's properties
   *
   * @param {object} updateData The data to save back into the DB
   * @param {function} callback The callback to fire after saving
   * @param {number} id An optional param to enter an ID of an item to update
   */
  Store.prototype.save = function(updateData, callback, id) {
    var data = JSON.parse(localStorage[this._dbName]);
    var todos = data.todos;

    callback = callback || function() {};
   // FIXED: Is not a good Idea to create an Id on this way because though 
   //the probabilities are little to be duplicated however the risk 
   //persist. so we can create an Id based on something unic as an Date() method  

    // Generate an ID
   //  var newId = "";
   //  var charset = "0123456789";

   //  for (var i = 0; i < charset.length; i++) {
   //    newId += charset.charAt(Math.floor(Math.random() * charset.length));
   //  }
// =======================================================

   //  We got to generate an ID in the Correct way
   let newId = new Date().getTime();
   //  we would passed this value on the else statemanet instead of the parseInt
// ===========================================================

    // If an ID was actually given, find the item and update each property
    if (id) {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          for (var key in updateData) {
            todos[i][key] = updateData[key];
          }
          break;
        }
      }

      localStorage[this._dbName] = JSON.stringify(data);
      callback.call(this, todos);
    } else {
      // Assign an ID FIXED

      // updateData.id = parseInt(newId);
      updateData.id = newId;

      todos.push(updateData);
      localStorage[this._dbName] = JSON.stringify(data);
      callback.call(this, [updateData]);
    }
  };

  /**
   * Will remove an item from the Store based on its ID
   *
   * @param {number} id The ID of the item you want to remove
   * @param {function} callback The callback to fire after saving
   */
  Store.prototype.remove = function(id, callback) {
    var data = JSON.parse(localStorage[this._dbName]);
    var todos = data.todos;
    // var todoId; there's no need of this variable

    for (var i = 0; i < todos.length; i++) {
      // if (todos[i].id == id) The values must to be Idendtity Strict equal (===) not just equal(==)
      if (todos[i].id === id) {
        // FIXED
        // todoId = todos[i].id; refactored
        todos.splice(i, 1);
      }
    }

    // refactored
    // this for loop is useless

    // for (var i = 0; i < todos.length; i++) {
    // 	if (todos[i].id == todoId) {
    // 		todos.splice(i, 1);
    // 	}
    // }

    localStorage[this._dbName] = JSON.stringify(data);
    callback.call(this, todos);
  };

  /**
   * Will drop all storage and start fresh
   *
   * @param {function} callback The callback to fire after dropping the data
   */
  Store.prototype.drop = function(callback) {
    var data = { todos: [] };
    localStorage[this._dbName] = JSON.stringify(data);
    callback.call(this, data.todos);
  };

  // Export to window
  window.app = window.app || {};
  window.app.Store = Store;
})(window);
