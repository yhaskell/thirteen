	exports.register = function() {
	var T   = this.thirteen,
		req = T.request,
		rsp = T.response;

	if (req.method != 'POST') {
		rsp.statusCode = 405;
		rsp.endj({
			message: "Method not allowed: " + req.method
		});
	} else {

		T.post().then(function() {
			T.db.register(req.post.email, req.post.password)
				.then(function(id) {
					rsp.statusCode = 200;
					rsp.endj({
						id: id, 
						email: req.post.email
					});
				}).catch(function(e) {
					rsp.statusCode = 409;
					rsp.endj({
						message: e.message
					});
				});

		});
	}
};

exports.auth = function() {
	var T   = this.thirteen,
		req = T.request,
		rsp = T.response;

	if (req.method != 'POST') {
		rsp.statusCode = 405;
		rsp.endj({
			message: "Method not allowed: " + req.method
		});
	} else {
		T.post().then(function() {
			T.db.auth(req.post.email, req.post.password)
				.then(function(data) {
					rsp.statusCode = 200;

					rsp.setHeader("Set-Cookie", [
						T.cookie.serialize('sessionkey', data.id, { expires: data.expires, path: '/'}),
						T.cookie.serialize('userid', data.owner, { expires: data.expires, path: '/'}),
					]);

					rsp.endj({
						session: data.id,
						email: req.post.email
					});
				})
				.catch(function(e) {
					rsp.statusCode = 401;
					rsp.endj({
						message: e.message
					});
				});
		});
	}	
};

exports.logout = function() {
	var T   = this.thirteen,
		req = T.request,
		rsp = T.response;

	rsp.statusCode = 200;
	rsp.setHeader("Set-Cookie", [
			T.cookie.serialize('sessionkey', -1, { expires: new Date(), path: '/'}),
			T.cookie.serialize('userid', -1, { expires: new Date(), path: '/'}),
		]);

	rsp.end();
};

exports.profile = function(id) {
	var T   = this.thirteen,
		req = T.request,
		rsp = T.response;

	var editable = false;

	var process = function() {
		if (req.method == "GET") {
			T.db.profile.get(id)
				.then(function(data) {
					rsp.statusCode = 200;
					data.editable = editable;
					rsp.endj(data);
				}).catch(function(e) {
					rsp.statusCode = 404;
					rsp.endj({message: e.message });
				});
		} else if (req.method == "POST") {
			if (editable === false) {
				rsp.statusCode = 403;
				rsp.end();
				return;
			}

			T.post().then(function() {
				T.db.profile.set(id, req.post.nick, req.post.realname)
					.then(function() {
						rsp.statusCode = 200;
						rsp.end();
					}).catch(function(e) {
						rsp.statusCode = 404;
						rsp.endj({ message: e.message });
					});
			});
		}					
	};

	if (T.cookies.sessionkey)
		T.db.handshake(T.cookies.sessionkey).then(function(data) {
			if (data.owner == id) editable = true;
			process();
		}).catch(function(e) {
			process();
		});
};

