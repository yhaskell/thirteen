exports.__default__ = function() {
	var T   = this.thirteen,
		rsp = T.response,
		req = T.request;

	T.db.cloud().then(function(data) {
		rsp.statusCode = 200;
		rsp.endj(data);
	});
};