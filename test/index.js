"use strict";
var Promise = require("any-promise");
var test = require("tape");
var spigot = require("stream-spigot");
var concat = require("terminus").concat;

var throughPromise = require("../");

test("simple transform", function (t) {
	var stream = throughPromise(function (data) {
		return Promise.resolve(data);
	});

	function confirm(results) {
		t.equals(results.toString(), "helloworld", "passed through properly");
		t.end();
	}

	spigot(["hello", "world"]).pipe(stream).pipe(concat(confirm));

});

test("changing transform", function (t) {
	var stream = throughPromise(function (data) {
		return data.toString().toUpperCase();
	});

	function confirm(results) {
		t.equals(results.toString(), "HELLOWORLD", "capitalized properly");
		t.end();
	}

	spigot(["hello", "world"]).pipe(stream).pipe(concat(confirm));
});

test("rejection", function (t) {
	var stream = throughPromise(function () {
		return Promise.reject(new Error("Whoops"));
	});

	function confirm() {
		t.fail("Shouldn't ever resolve");
	}

	stream.on("error", function (e) {
		t.ok(e, "passed error properly");
		t.end();
	});

	spigot(["hello", "world"]).pipe(stream).pipe(concat(confirm));
});

test("throwing", function (t) {
	var stream = throughPromise(function () {
		throw new Error("Whoops");
	});

	function confirm() {
		t.fail("Shouldn't ever resolve");
	}

	stream.on("error", function (e) {
		t.ok(e, "passed error properly");
		t.end();
	});

	spigot(["hello", "world"]).pipe(stream).pipe(concat(confirm));
});
