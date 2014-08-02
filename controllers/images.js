exports.upload = function() {
	this.render();
};

exports.__default__ = function(id) {
	var T   = this.thirteen,
		rsp = T.response,
		req = T.request;

	rsp.setHeader("Set-Cookie", [
		T.cookie.serialize('image-id', id, {expires: new Date().add(10 * 1000), path: '/' })
	]);

	this.render();
};

exports.by = function(id) {
	var T   = this.thirteen,
		rsp = T.response,
		req = T.request;

	rsp.setHeader("Set-Cookie", [
		T.cookie.serialize('user-id', id, {expires: new Date().add(10 * 1000), path: '/' })
	]);

	this.render();
};