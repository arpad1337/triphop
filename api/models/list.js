/*
 * List
 * @author rpi1337
 */

var helpers = require("../../helpers");
var Model = require("./model");

module.exports = (function(){
	helpers.extend(List, Model);
	function List(data) {
		List.superClass.constructor.call(this, data);
	};
	List.prototype.attributes = {
		id: Number,
		title: String
	};
	List.table = "lists";
	return List;
})();