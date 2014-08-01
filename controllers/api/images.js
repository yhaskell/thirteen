var formidable = require('formidable'),
	util = require('util'),
	gm = require('gm');


exports.upload = function () {
	var T   = this.thirteen,
		rsp = T.response,
		req = T.request;

	if (req.method != 'POST') {
		rsp.statusCode = 405;
		rsp.endj({
			message: "Method not allowed: " + req.method
		});
	} else {
		var sessionkey = thirteen.cookies.sessionkey;

		T.db.handshake(sessionkey).then(function (data) {
			var form = new formidable.IncomingForm();

			form.uploadDir = "./tmp/";
			form.maxFieldsSize = 12 * 1024 * 1024;
			form.maxFields = 1000;

			var userId = data.owner;

			form.parse(req, function(err, fields, files) {
				var path = '/' + files.uploadFile.path.replace('\\', '/');

				T.db.images.add(owner, path.replace('tmp', 'photos'))
					.then(function (data) {
						rsp.statusCode = 200;
						rsp.endj({
							path: path, 
							id: data.id
						});
					});
			});
		}).catch(function (e) {
			rsp.statusCode = 403;
			rsp.end();
		});
	}
};




exports.update = function(id) {
	var T   = this.thirteen,
		rsp = T.response,
		req = T.request;

	if (req.method != 'POST') {
		rsp.statusCode = 405;
		rsp.endj({
			message: "Method not allowed: " + req.method
		});
	} else {
		T.post().then(function() {
			var desc = req.post.desc,
				tags = req.post.tags,
				size = req.post.size,
				x 	 = req.post.x,
				y    = req.post.y;

		T.post().then(function () {
			T.db.images.get(id)
				.then(function(data) {
					T.db.images.update(id, desc, tags);

					gm('.' + data.path.replace('photos', 'tmp'))
						.crop(size, size, x, y)
						.resize(610,610)
						.write('.' +data.path, function (err) {
							if (err) {
								rsp.statusCode = 500;
								T.log(err);
							} else {
								rsp.statusCode = 200;
								rsp.endj({
									id: id, 
									path: data.path
								});
							}
						});
				});
			});
		});
	}
};