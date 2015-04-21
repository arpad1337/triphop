/*
 * ListsController
 * @author rpi1337
 */

var Store = require('../../store').init();
var List = require('../models/list');
var SocketService = require('../../socket-service');

module.exports = (function() {
	return {
		controller: 'lists',
		getLists: function(req, res) {
			var data = Store.findAll('lists');
			res.json(data.toJSON());
		},
		addList: function(req, res) {
			var list = new List({
				title: req.body.title
			});
			Store.add('lists', list);
			Store.commit();
			res.json(list.toJSON());
			SocketService.publish('new-list', list.toJSON());
		},
		updateList: function(req, res) {
			var list = Store.find('lists', Number(req.params.id));
			list.data.title = req.body.title;
			Store.commit();
			res.json(list.toJSON());
			SocketService.publish('update-list', list.toJSON());
		},
		removeList: function(req, res) {
			Store.remove('lists', Number(req.params.id));
			Store.commit();
			res.json({
				status: true
			});
			SocketService.publish('delete-list', Number(req.params.id));
		}

	};
})();