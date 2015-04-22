/*
 * List
 * @author rpi1337
 */

var helpers = require("../../helpers");
var Model = require("./model");

module.exports = (function(Model){
	helpers.extend(Todo, Model);
	function Todo(data) {
		Todo.superClass.constructor.call(this, data);
	};
	Todo.prototype.attributes = {
		id: Number,
		listId: Number,
		title: String,
		description: String
	};
	Todo.table = "todos";
	return Todo;
})(Model);