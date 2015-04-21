/*
 * TodosController
 * @author rpi1337
 */

var Store = require('../../store').init();
var Todo = require('../models/todo');
var SocketService = require('../../socket-service');

module.exports = (function() {
	return {
		controller: 'todos',
		getTodosByListId: function(req, res) {
			var data = Store.findAll('todos');
			var result = data.filter(function(el) {
				return el.data.listId === Number(req.params.id);
			});
			res.json(result);
		},
		addTodo: function(req, res) {
			var todo = new Todo({
				listId: Number(req.params.id),
				title: req.body.title,
				description: req.body.description
			});
			Store.add('todos', todo);
			Store.commit();
			res.json(todo.toJSON());
			SocketService.publish('new-todo', todo.toJSON());
		},
		updateTodo: function(req, res) {
			var todo = Store.find('todos', Number(req.params.id));
			todo.data.title = req.body.title;
			todo.data.description = req.body.description;
			Store.commit();
			res.json(todo.toJSON());
			SocketService.publish('update-todo', todo.toJSON());
		},
		removeTodo: function(req, res) {
			Store.remove('todos', Number(req.params.id));
			Store.commit();
			res.json({success:true});
			SocketService.publish('delete-todo', req.params.id);
		}
	};
})();