"use strict";
var through2 = require("through2");
var Promise = require("any-promise");
var xtend = require("xtend");

var ctor = ensure_args(makeCtor);
var ctorObj = ensure_args(makeCtorObj);

module.exports = create;
module.exports.ctor = ctor;
module.exports.obj = obj;

function create(options, transform) {
	return new(ctor(options, transform))();
}

function obj(options, transform) {
	return new(ctorObj(options, transform))();
}

function ensure_args(creator) {
	return function (options, transform) {
		if (typeof options === "function") {
			transform = options;
			options = {};
		}

		return creator(options, transform);
	};
}

function makeCtor(options, transform) {
	return through2.ctor(options, doTransform);

	function doTransform(chunk, encoding, callback) {
		var stream = this;
		Promise.resolve(chunk).then(transform).then(function (result) {
			callback(null, result);
		}).catch(callback);
	}
}

function makeCtorObj(options, transform) {
	options = xtend(options, {
		objectMode: true
	});

	return makeCtor(options, transform);
}
