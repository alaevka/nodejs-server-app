var app = require('express')();
//var Chance = require('chance');
//var chance = new Chance();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
//var started = 'stopped';
app.get('/', function(req, res){
  res.sendFile('client.html', { root: path.join(__dirname, './') });
});

// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
// 	console.log('user disconnected');
//   });
//   socket.on('action', function(data){
// 	console.log('received action');
    
// 	if(data.todo=='start') {
// 		console.log('action name is START');
// 		if(started != 'started') {
// 			t=setInterval( function() {
// 				var random_coordinates = chance.coordinates();
// 				console.log(random_coordinates);
// 				io.emit('generated', random_coordinates);
// 			}, 1000);
// 			started = 'started';
// 		} else {
// 			console.log('already started');
// 		}
// 	} else if(data.todo=='stop') {
// 		console.log('action name is STOP');
//         clearInterval(t);
// 		started = 'stopped';
// 	}
	
//   });
// });


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
	console.log('user disconnected');
  });
  socket.on('data_send', function(data){
	//console.log('received data');
    console.log(data.coordinates+', '+socket.id);
	
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});