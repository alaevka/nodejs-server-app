var io = require('socket.io').listen(3000);
var mongo = require("mongodb");
var mongodbUri = "mongodb://127.0.0.1/tracker"

io.on('connection', function(socket){
  	console.log('a user connected');
  	socket.on('disconnect', function(){
		console.log('user disconnected');
  	});
  	
        mongo.MongoClient.connect(mongodbUri, function (err, db) {
	        if (err) throw err;
	        console.log("Connected to Database");
	        socket.on("data_send", function(obj){
	        db.collection('coordinates').insert({lat: obj['lat'], lon: obj['lon'], time: Date.now(), uid: socket.id}, function(err, records) {
	            if(err) throw err;
	            console.log("Record added");
	        });
	    });
    });
});