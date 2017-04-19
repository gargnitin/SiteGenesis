var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');
var URLUtils = require('dw/web/URLUtils');


function start(){
	//response.setContentType('text/html');
	//response.getWriter().println("hello world");	
	var address : Object = new Object();
	address.firstName = "Nitin";
	address.lastName = "Garg";
	
	 app.getForm('test.testcustomer').copyFrom(address);
	

	app.getView({
        ContinueURL: URLUtils.https('Test-SubmitTestForm')
    }).render("account/test");
    
    
    //var productModel = app.getModel("test").Get("008884303989");
    
    var PM = require('../scripts/models/' + "test" + 'Model');
    var productModel = new PM("008884303989");
    
    
    var online = productModel.isOnline();
    var searchable = productModel.isSearchable();
    
}

function includeHeader(){
	var productid : string = request.httpParameterMap.pid;
	app.getView({pid : productid}).render("account/test3");
}

function submitTestForm(){
	var address : Object = new Object();
	address.firstName = "";
	address.lastName = "";
	address.state1 = "";
	
	 app.getForm('test.testcustomer').copyTo(address);
	 address.state1 = app.getForm('test.testcustomer.state1').value();
	 
	 app.getForm('test').handleAction({
	 	confirm : function(){
	 		app.getView("test", {var1 : "test", add : address}).render("account/test2");
	 	},
	 	confirm1 : function(){
	 		app.getView({var1 : "test123", add : address}).render("account/test3");
	 	},
	 	error : function(){
	 		//response.setContentType('text/html');
			//response.getWriter().println("hello world");
			
			app.getView({
        		ContinueURL: URLUtils.https('Test-SubmitTestForm')
    			}).render("account/test");	
	 	}	 	
	 });
}

exports.Start = guard.ensure(['get'], start);
exports.IncludeHeader = guard.ensure(['include'], includeHeader);
exports.SubmitTestForm = guard.ensure(['post', 'https'], submitTestForm);