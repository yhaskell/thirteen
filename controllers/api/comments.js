exports.__default__ = function(id) {
	var T   = this.thirteen,
		rsp = T.response,
		req = T.request;

	T.db.comments.get(id).then(function(data) {
		rsp.statusCode = 200;
		rsp.endj(data);
	});
};

exports.put = function(id) {
	var T   = this.thirteen,
		rsp = T.response,
		req = T.request;

	if (req.method != 'POST') {
		rsp.statusCode = 405;
		return rsp.endj({
			message: "Method not allowed: " + req.method
		});
	}
	
	T.post().then(function() {
		T.db.comments.put(id, req.post.owner, req.post.comment)
			.then(function() {
				rsp.statusCode = 200;
				rsp.end();
			});
	});
};