/*
 * Router
 * @author rpi1337
 */
var fs = require('fs');

module.exports = (function(){
	var _controllers = {};
	var _prefix = '/api'
	var _routes = [
		{
			path: '/lists',
			method: 'get',
			controller: 'lists',
			action: 'getLists'
		},
		{
			path: '/lists',
			method: 'post',
			controller: 'lists',
			action: 'addList'
		},
		{
			path: '/lists/:id',
			method: 'get',
			controller: 'todos',
			action: 'getTodosByListId'
		},
		{
			path: '/lists/:id',
			method: 'put',
			controller: 'lists',
			action: 'updateList'
		},
		{
			path: '/lists/:id',
			method: 'post',
			controller: 'todos',
			action: 'addTodo'
		},
		{
			path: '/lists/:id',
			method: 'delete',
			controller: 'lists',
			action: 'removeList'
		},
		{
			path: '/todos/:id',
			method: 'put',
			controller: 'todos',
			action: 'updateTodo'
		},
		{
			path: '/todos/:id',
			method: 'delete',
			controller: 'todos',
			action: 'removeTodo'
		}
	];
	return {
		init: function(app){
			var controllers = fs.readdirSync('./api/controllers');
			for(var controller in controllers) {
				var Controller = require('./controllers/' + (controllers[controller].split('.'))[0]);
				_controllers[Controller.controller] = Controller;
			}
			for(var route in _routes) {
				route = _routes[route];
				app[route.method](_prefix + route.path, _controllers[route.controller][route.action]);
			}
			console.log('Router::init','Router initialized');
		}
	};
})();