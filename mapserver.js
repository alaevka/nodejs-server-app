var io = require('socket.io').listen(8080);
var mubsub = require('mubsub');
var client = mubsub('mongodb://localhost:27017/tracker');
var channel = client.channel('coordinates', { size: 1000000000});

io.on('connection', function(socket){
  	console.log('a user connected');
  	socket.on('disconnect', function(){
		console.log('user disconnected');
  	});
});
channel.on('document', function(data){
  	io.emit('updated', data);
});

