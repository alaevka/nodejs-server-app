var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var mongo = require("mongodb");
var mongodbUri = "mongodb://127.0.0.1/laravel5"

//var started = 'stopped';
app.get('/', function(req, res){
  res.sendFile('client.html', { root: path.join(__dirname, './') });
});



io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
	console.log('user disconnected');
  });
  socket.on('data_send', function(data){

    //console.log(data.coordinates+', '+socket.id);
    mongo.MongoClient.connect(mongodbUri, function (err, db) {
        if (err) throw err;
        console.log("Connected to Database");
        db.collection('coordinates').insert({coordinates: data.coordinates, time: Date.now(), uid: socket.id}, function(err, records) {
            if(err) throw err;
            console.log("Record added");
        });
    });

	
  });
  socket.on('event_send', function(data){
    console.log(data.event_id+', '+socket.id);
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});