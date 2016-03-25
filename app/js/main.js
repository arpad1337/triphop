angular.module('triphop', [])
	.service('SocketService', function(){
		var SocketService = (function(){
			var _socketConnection = false;
			var _testConnection = function() {
				_socketConnection.on('reply', function(){
					console.log('Socket connection is up.');
				});
				_socketConnection.emit('echo');
			};
			return {
				init: function() {
					_socketConnection = io(window.location.href);
					_testConnection();
					return this;
				},
				subscribe: function(event, callback) {
					_socketConnection.on(event, callback);
				}
			};
		})();
		return SocketService.init();
	})
	.service('TodosService', ['$http', 'SocketService', function($http, SocketService) {
		var TodosService = (function(){
			var _subscribers = [];
			var _onNewTodo = function(data) {
				var data = JSON.parse(data);
				if(data.listId === TodosService.id) {
					TodosService.data.push(data);
					_flush(TodosService.data);
				}
			};
			var _flush = function(data){
				_subscribers.forEach(function(callback){
					setTimeout(callback.bind(data), 1);
				});
			};
			return {
				init: function() {
					SocketService.subscribe('new-todo', _onNewTodo);
					SocketService.subscribe('update-todo', this.fetch.bind(TodosService));
					SocketService.subscribe('delete-todo', this.fetch.bind(TodosService));
					return this;
				},
				id: -1,
				data: [],
				fetch: function() {
					var self = this;
					return $http.get('/api/lists/' + this.id).then(function(data){
						self.data = data.data;
						_flush(self.data);
					}, function(err) {
						console.error(err);
					});
				},
				add: function(title, description) {
					return $http.post('/api/lists/' + this.id, {title: title, description: description}); 
				},
				update: function(id, title, description) {
					var self = this;
					return $http.put('/api/todos/' + id, {title: title, description: description});
				},
				delete: function(id) {
					var self = this;
					return $http.delete('/api/todos/' + id);
				},
				subscribe: function(callback) {
					_subscribers.push(callback);
				}
			};
		})();
		return TodosService.init();
	}])
	.service('ListsService', ['$http', 'SocketService', function($http, SocketService){
		var ListsService = (function(){
			var _subscribers = [];
			var _onNewList = function(data) {
				var data = JSON.parse(data);
				ListsService.data.push(data);
				_flush(ListsService.data);
			};
			var _flush = function(data){
				_subscribers.forEach(function(callback){
					setTimeout(callback.bind(data), 1);
				});
			};
			return {
				init: function() {
					SocketService.subscribe('new-list', _onNewList);
					SocketService.subscribe('update-list', this.fetch.bind(ListsService));
					SocketService.subscribe('delete-list', this.fetch.bind(ListsService));
					return this;
				},
				data: [],
				fetch: function() {
					var self = this;
					self.data = [];
					return $http.get('/api/lists').then(function(data){
						self.data = data.data;
						_flush(self.data);
					}, function(err) {
						console.error(err);
					});
				},
				add: function(title) {
					var self = this;
					return $http.post('/api/lists',{title: title});
				},
				update: function(id, title) {
					var self = this;
					return $http.put('/api/lists/' + id, {title: title});
				},
				delete: function(id) {
					var self = this;
					return $http.delete('/api/lists/' + id);
				},
				subscribe: function(callback) {
					_subscribers.push(callback);
				}
			};
		})();
		return ListsService.init();
	}])
	.controller('HeaderController', ['$scope','ListsService', function($scope, ListsService){
		var self = this;
		self.createList = function(){
			var listName = self.listName;
			self.listName = "";
			ListsService.add(listName);
		}
	}])
	.controller('TodosController', ['$scope','TodosService', function($scope, TodosService){
		var self = this;
		TodosService.subscribe(function(){
			var data = this;
			$scope.$apply(function(){
				self.todos = data;
			});
		});
		TodosService.fetch();
		self.add = function() {
			TodosService.add(self.title, self.description);
			self.title = "";
			self.description = "";
		}
		self.modify = function(id, title, description) {
			TodosService.update(id, title, description);
		}
		self.delete = function(id) {
			TodosService.delete(id);
		}
	}])
	.controller('ListController', ['$scope','ListsService', function($scope, ListsService){
		var self = this;
		self.lists = ListsService.data;
		ListsService.subscribe(function(){
			var data = this;
			$scope.$apply(function(){
				self.lists = data;
			});
		});
		ListsService.fetch();
		self.modify = function(id, title) {
			ListsService.update(id, title);
		};
		self.delete = function(id) {
			ListsService.delete(id);
		};	
	}])
	.controller('MainController', ['$scope','TodosService', function($scope, TodosService){
		var self = this;
		self.tab = 'lists';
		self.view = function(id) {
			TodosService.id = Number(id);
			self.tab = 'viewList';
		};
		self.back = function() {
			self.tab = "lists";
		}
	}]);
