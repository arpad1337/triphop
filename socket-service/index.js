/*
 * SocketService
 * @author rpi1337
 */

 module.exports = (function () {
 	var _isInitialized = false;
 	var _IO = false;
 	var _connections = {};
 	var _setHandlers = function(socket) {
 		_connections[socket.id] = socket;
 		socket.on('echo', _onEcho);
 	};
 	var _onEcho = function() {
 		this.emit('reply');
 	};
 	var _onDisconnect = function(socket) {
 		delete _connections[socket.id];
 	};
 	var _broadcast = function(event, message) {
 		for(var socket in _connections) {
 			_connections[socket].emit(event, JSON.stringify(message));
 		}
 	};
 	return {
 		init: function(IO){
 			_IO = IO;
 			if(!_isInitialized) {
 				_isInitialized = true;
 			}
 			return this;
 		},
 		listen: function() {
 			_IO.on('connection', _setHandlers);
 			_IO.on('disconnect', _onDisconnect);
 		},
 		publish: function(event, message) {
 			_broadcast(event, message);
 		}
 	};
 })();