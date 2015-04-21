/*
 * SocketService
 * @author rpi1337
 */

module.exports = (function  () {
	var _ID = 1;
	function Model(data) {
		this.data = data;
		if(!data.id) {
			data.id = _ID;
		}
		_ID++;
		if(!this.validate()){
			throw new Error('Model->constructor Validation error');
		}
		return this;
	}
	Model.prototype.attributes = {};
	Model.prototype.validate = function() {
		var row;
		var pattern;
		for(var attribute in this.data) {
			row = this.data[attribute];
			pattern = this.attributes[attribute];
			if(! new pattern(row)){
				return false;
			}
		}
		return true;
	}
	Model.prototype.toJSON = function() {
		return this.data;
	};
	return Model;
})();