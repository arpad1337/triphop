/*
 * Store
 * @author rpi1337
 */
var fs = require('fs');

Object.defineProperty(Array.prototype, 'toJSON', {
	value: function() {
		return this.map(function(el) {
			if (el.toJSON && typeof el.toJSON === "function") {
				return el.toJSON();
			}
			return el;
		});
	},
	writable: true,
	configurable: true,
	enumerable: false
});

module.exports = (function() {
	var _isInitialized = false;
	var _tables = {};
	var _models = {};
	return {
		init: function() {
			if (_isInitialized) {
				return this;
			}
			_isInitialized = true;
			var models = fs.readdirSync('./api/models');
			for (var model in models) {
				var Class = require('../api/models/' + (models[model].split('.'))[0]);
				if (Class.table) {
					_models[Class.table] = Class;
				}
			}
			var data = JSON.parse(fs.readFileSync('./store/data.json'));
			for (var table in data) {
				this.createTable(table);
				for (var row in data[table]) {
					_tables[table].push(new _models[table](data[table][row]));
				}
			}
			console.log('Store::init', 'Data loaded');
			return this;
		},
		createTable: function(tableName) {
			if (!_tables[tableName]) {
				console.log('Store::createTable', 'Creating table ' + tableName);
				_tables[tableName] = [];
			}
			return this;
		},
		commit: function() {
			var result = {};
			for (var table in _tables) {
				if (!result[table]) {
					result[table] = [];
				}
				for (var row in _tables[table]) {
					result[table].push(_tables[table][row].toJSON());
				}
			}
			fs.writeFileSync('./store/data.json', JSON.stringify(result));
		},
		find: function(table, id) {
			var i = 0;
			while (i < _tables[table].length && !(_tables[table][i].data.id == id)) {
				i++;
			}
			if (i == _tables[table].length) {
				return false;
			}
			return _tables[table][i];
		},
		findAll: function(table) {
			return _tables[table];
		},
		remove: function(table, id) {
			var i = 0;
			while (i < _tables[table].length && !(_tables[table][i].data.id == id)) {
				i++;
			}
			if (i == _tables[table].length) {
				return false;
			}
			_tables[table].splice(i, 1);
			return this;
		},
		add: function(table, model) {
			_tables[table].push(model);
			return this;
		}
	};
})();