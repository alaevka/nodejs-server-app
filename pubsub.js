var mongo = require("mongodb");
Cursor = mongo.Cursor;
var mongodbUri = "mongodb://127.0.0.1/laravel5";
 
mongo.MongoClient.connect (mongodbUri, function (err, db) {
 
  	db.collection('coordinates', function(err, collection) {
  		collection.isCapped(function (err, capped) { 
	    if (err) {
			console.log ("Error when detecting capped collection.  Aborting.  Capped collections are necessary for tailed cursors.");
			process.exit(1);
	    }
	    if (!capped) {
			console.log (collection.collectionName + " is not a capped collection. Aborting.  Please use a capped collection for tailable cursors.");
			process.exit(2);
	    }
	    console.log ("Success connecting to " + mongodbUri);
	 //    collection.find({}, {"tailable": 1, "sort": [["$natural", 1]]}, function(err, cursor) {
		// 	cursor.intervalEach(300, function(err, item) { // intervalEach() is a duck-punched version of each() that waits N milliseconds between each iteration.
		// 		if(item != null) {
		// 			console.log(item);
		// 		//socket.emit("all", item); // sends to clients subscribed to type "all"
		// 	}
		// });
		// });

  		collection.find({}, {tailable:true, awaitdata:true, numberOfRetries:-1})
                      //.sort({ $natural: 1 })
                      .each(function(err, doc) {
      console.log(doc);
    })

	});
  	});
 
});

// Duck-punching mongodb driver Cursor.each.  This now takes an interval that waits 
// "interval" milliseconds before it makes the next object request... 
Cursor.prototype.intervalEach = function(interval, callback) {
    var self = this;
    if (!callback) {
	throw new Error("callback is mandatory");
    }

    if(this.state != Cursor.CLOSED) {
	//FIX: stack overflow (on deep callback) (cred: https://github.com/limp/node-mongodb-native/commit/27da7e4b2af02035847f262b29837a94bbbf6ce2)
	setTimeout(function(){
	    // Fetch the next object until there is no more objects
	    self.nextObject(function(err, item) {        
		if(err != null) return callback(err, null);

		if(item != null) {
		    callback(null, item);
		    self.intervalEach(interval, callback);
		} else {
		    // Close the cursor if done
		    self.state = Cursor.CLOSED;
		    callback(err, null);
		}

		item = null;
	    });
	}, interval);
    } else {
	callback(new Error("Cursor is closed"), null);
    }
};
