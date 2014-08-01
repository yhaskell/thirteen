var Thirteen = require("thirteen"),
	fs 		 = require("fs"),
	http     = require("http");



var processStatic = function(req, rsp, path) {
	fs.readFile(path, function(err, contents) {
		if (err) {
			rsp.statusCode = 404;
			rsp.end("Page not found.");
		} else {
			rsp.statusCode = 200;
			rsp.end(contents);
		}
	});
};

http.createServer(function(req, rsp) {

	var thirteen = new Thirteen(req, rsp);

	var route = thirteen.route(req.url);

	var controller;	

	try {
		controller = new thirteen.controller(route);	
		if (controller) controller.execute();			
	} catch (e) {		
		if (e.code == 'MODULE_NOT_FOUND' || e.code == 'ACTION_NOT_FOUND') {
			if (route.path)
				return processStatic(req, rsp, './' + route.path);
			else {
				rsp.statusCode = 404;
				rsp.end();
			}
		} else {
			thirteen.log(e);
			rsp.statusCode = 500;
			rsp.end();
		}
	}
	// thirteen.log(req.method, req.url, rsp.statusCode, http.STATUS_CODES[rsp.statusCode]);	
	
}).listen(8000);

console.log("Server is running on the port 8000");

