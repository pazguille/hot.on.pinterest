var express = require("express"),
	exec = require("child_process").exec,
	port = 8080,
	app = module.exports = express.createServer();

/**
 * App configuration.
 */
app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
});

app.configure("development", function () {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure("production", function () {
	app.use(express.errorHandler()); 
});


/**
 * Routes.
 */
// Index
app.get("/pinterest/hottest", function (req, res, next) {	
	exec("curl -X GET https://api.pinterest.com/v2/popular/?limit=10&page=" + req.query.page, function (err, stdout, stderr) {
		if (req.query.callback) {
			res.header("Content-Type", "application/javascript");
			res.send(req.query.callback + "(" + stdout + ")");
			return;
		}
		res.header("Content-Type", "application/json");
		res.send(stdout);
	});
});


/**
 * App start
 */
app.listen(port);

/**
 * Log
 */
console.log("Express server listening on port %d", app.address().port);