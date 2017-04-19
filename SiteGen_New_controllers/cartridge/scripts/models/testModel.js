var AbstractModel = require('./AbstractModel');
var app = require('~/cartridge/scripts/app');

var testModel = AbstractModel.extend({
	
	init: function(id){
		 obj = dw.catalog.ProductMgr.getProduct(id);
		 var instance = this._super(obj);
		 return instance;
	},
	
	isOnline : function(){
		if(!this.object){
			return false;
		}
		
		return this.object.isOnline();
		
	},
	
	isSearchable : function()
	{
		if(!this.object){
			return false;
		}
		
		return this.object.isSearchable();
	}
});

testModel.Get = function(id){
	obj = dw.catalog.ProductMgr.getProduct(id);
	 return new testModel(obj);
};


module.exports = testModel;