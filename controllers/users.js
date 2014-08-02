exports.register = function() {
	this.render();
};

exports.auth = function() {
	var T   = this.thirteen,
		rsp = T.response,
		req = T.request;

	var referer = req.headers.referer;

	if (!referer || referer === '' || referer.match(/register/)) referer = '/';
	
	rsp.setHeader("Set-Cookie", [
		T.cookie.serialize('refer-to', referer, {expires: new Date().add(10 * 1000), path: '/' })
	]);

	this.render();
};

exports.profile = function(id) {
	var T   = this.thirteen,
		rsp = T.response,
		req = T.request;

	rsp.setHeader("Set-Cookie", [
		T.cookie.serialize('profile-id', id, {expires: new Date().add(10 * 1000), path: '/' })
	]);

	this.render();
};

exports.logout = function() {
	this.render();
};