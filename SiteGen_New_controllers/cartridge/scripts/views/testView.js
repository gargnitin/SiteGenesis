var View = require('./View');

var testView = View.extend({
	
 init : function(params){
	 this._super(params);
	 this.testData ="yes this is test data from View";
	 return this;
 }
	
});

module.exports = testView;