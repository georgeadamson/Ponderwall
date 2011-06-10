(function() {

var subscriptions = {};
function subscribe( topic, callback ) {
	subscriptions[ topic ] = subscriptions[ topic ] || [];
	subscriptions[ topic ].push( callback );
	return amplify.subscribe( topic, callback );
}

var ajax = $.ajax;
var lifecycle = {
	setup: function() {
		amplify.request.resources = {};
	},
	teardown: function() {
		$.ajax = ajax;
		$.each( subscriptions, function( topic, callbacks ) {
			$.each( callbacks, function( _,callback ) {
				amplify.unsubscribe( topic, callback );
			});
		});
	}
};

module( "amplify.request", lifecycle );

test( "invalid resource id", function() {
	expect( 4 );

	subscribe( "request.before", function() {
		ok( false, "no messages should be published for invalid resources" );
	});

	try {
		amplify.request();
		ok( false, "should throw error with no resrouceId" );
	} catch( e ) {
		equal( e, "amplify.request: no resourceId provided" );
	}

	try {
		amplify.request( "missing" );
		ok( false, "should throw error with invalid resourceId" );
	} catch ( e ) {
		equal( e, "amplify.request: unknown resourceId: missing" );
	}

	try {
		amplify.request({ data: { foo: "bar" } });
		ok( false, "should throw error with invalid resourceId" );
	} catch ( e ) {
		equal( e, "amplify.request: no resourceId provided" );
	}

	try {
		amplify.request({ resourceId: "missing" });
		ok( false, "should throw error with invalid resourceId" );
	} catch ( e ) {
		equal( e, "amplify.request: unknown resourceId: missing" );
	}
});

module( "amplify.request.define - fn", lifecycle );

test( "request( id )", function() {
	expect( 9 );

	amplify.request.define( "test", function( settings ) {
		equal( settings.resourceId, "test", "defintion: resouceId" );
		deepEqual( settings.data, {}, "definition: data" );
		settings.success({ simple: true });
	});
	subscribe( "request.before", function( settings ) {
		equal( settings.resourceId, "test", "before message: settings.resourceId" );
	});
	subscribe( "request.success", function( settings, data ) {
		equal( settings.resourceId, "test", "success message: settings.resrouceId" );
		deepEqual( settings.data, {},
			"success message: settings.data" );
		deepEqual( data, { simple: true }, "success message: data" );
	});
	subscribe( "request.complete", function( settings, data ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( settings.data, {},
			"complete message: settings.data" );
		deepEqual( data, { simple: true }, "complete message: data" );
	});
	subscribe( "request.error", function() {
		ok( false, "error message published" );
	});
	amplify.request( "test" );
});

test( "request( id, fn )", function() {
	expect( 10 );

	amplify.request.define( "test", function( settings ) {
		equal( settings.resourceId, "test", "defintion: resouceId" );
		deepEqual( settings.data, {}, "definition: data" );
		settings.success({ simple: true });
	});
	subscribe( "request.before", function( settings ) {
		equal( settings.resourceId, "test", "before message: settings.resourceId" );
	});
	subscribe( "request.success", function( settings, data ) {
		equal( settings.resourceId, "test", "success message: settings.resrouceId" );
		deepEqual( settings.data, {},
			"success message: settings.data" );
		deepEqual( data, { simple: true }, "success message: data" );
	});
	subscribe( "request.complete", function( settings, data ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( settings.data, {},
			"complete message: settings.data" );
		deepEqual( data, { simple: true }, "complete message: data" );
	});
	subscribe( "request.error", function() {
		ok( false, "error message published" );
	});
	amplify.request( "test", function( data ) {
		deepEqual( data, { simple: true }, "success callback: data" );
	});
});

test( "request( id, data, fn )", function() {
	expect( 10 );

	amplify.request.define( "test", function( settings ) {
		equal( settings.resourceId, "test", "defintion: resouceId" );
		deepEqual( settings.data, { foo: "bar", baz: 1 }, "definition: data" );
		settings.success({ simple: true });
	});
	subscribe( "request.before", function( settings ) {
		equal( settings.resourceId, "test", "before message: settings.resourceId" );
	});
	subscribe( "request.success", function( settings, data ) {
		equal( settings.resourceId, "test", "success message: settings.resrouceId" );
		deepEqual( settings.data, { foo: "bar", baz: 1 },
			"success message: settings.data" );
		deepEqual( data, { simple: true }, "success message: data" );
	});
	subscribe( "request.complete", function( settings, data ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( settings.data, { foo: "bar", baz: 1 },
			"complete message: settings.data" );
		deepEqual( data, { simple: true }, "complete message: data" );
	});
	subscribe( "request.error", function() {
		ok( false, "error message published" );
	});
	amplify.request( "test", { foo: "bar", baz: 1 }, function( data ) {
		deepEqual( data, { simple: true }, "success callback: data" );
	});
});

test( "request( hash ) success", function() {
	expect( 10 );

	amplify.request.define( "test", function( settings ) {
		equal( settings.resourceId, "test", "defintion: resouceId" );
		deepEqual( settings.data, { foo: "bar", baz: 1 }, "definition: data" );
		settings.success({ simple: true });
	});
	subscribe( "request.before", function( settings ) {
		equal( settings.resourceId, "test", "before message: settings.resourceId" );
	});
	subscribe( "request.success", function( settings, data ) {
		equal( settings.resourceId, "test", "success message: settings.resrouceId" );
		deepEqual( settings.data, { foo: "bar", baz: 1 },
			"success message: settings.data" );
		deepEqual( data, { simple: true }, "success message: data" );
	});
	subscribe( "request.complete", function( settings, data ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( settings.data, { foo: "bar", baz: 1 },
			"complete message: settings.data" );
		deepEqual( data, { simple: true }, "complete message: data" );
	});
	subscribe( "request.error", function() {
		ok( false, "error message published" );
	});
	amplify.request({
		resourceId: "test",
		data: { foo: "bar", baz: 1 },
		success: function( data ) {
			deepEqual( data, { simple: true }, "success callback: data" );
		}
	});
});

test( "request( hash ) error", function() {
	expect( 10 );

	amplify.request.define( "test", function( settings ) {
		equal( settings.resourceId, "test", "defintion: resouceId" );
		deepEqual( settings.data, { foo: "bar", baz: 1 }, "definition: data" );
		settings.error({ simple: true });
	});
	subscribe( "request.before", function( settings ) {
		equal( settings.resourceId, "test", "before message: settings.resourceId" );
	});
	subscribe( "request.error", function( settings, data ) {
		equal( settings.resourceId, "test", "error message: settings.resrouceId" );
		deepEqual( settings.data, { foo: "bar", baz: 1 },
			"error message: settings.data" );
		deepEqual( data, { simple: true }, "error message: data" );
	});
	subscribe( "request.complete", function( settings, data ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( settings.data, { foo: "bar", baz: 1 },
			"complete message: settings.data" );
		deepEqual( data, { simple: true }, "complete message: data" );
	});
	subscribe( "request.success", function() {
		ok( false, "success message published" );
	});
	amplify.request({
		resourceId: "test",
		data: { foo: "bar", baz: 1 },
		success: function() {
			ok( false, "success callback invoked" );
		},
		error: function( data ) {
			deepEqual( data, { simple: true }, "error callback: data" );
		}
	});
});

test( "extra data - success", function() {
	expect( 12 );

	amplify.request.define( "test", function( settings ) {
		var number = Math.random() * settings.data.min +
			( settings.data.max - settings.data.min );
		settings.success( { data: "is good" }, { number: number } );
	});
	subscribe( "request.success", function( settings, data, extra ) {
		deepEqual( data, { data: "is good" }, "success message: data " );
		ok( extra.number > settings.data.min && extra.number < settings.data.max,
			"success message: extra" );
	});
	subscribe( "request.complete", function( settings, data, extra ) {
		deepEqual( data, { data: "is good" }, "complete message: data " );
		ok( extra.number > settings.data.min && extra.number < settings.data.max,
			"complete message: extra" );
	});

	amplify.request( "test", { min: 5, max: 10 }, function( data, extra ) {
		deepEqual( data, { data: "is good" }, "success callback: data " );
		ok( extra.number > 5 && extra.number < 10, "success callback: extra" );
	});
	amplify.request( "test", { min: 500, max: 1000 }, function( data, extra ) {
		deepEqual( data, { data: "is good" }, "success callback: data " );
		ok( extra.number > 500 && extra.number < 1000, "success callback: extra" );
	});
});

test( "extra data - error", function() {
	expect( 12 );

	amplify.request.define( "test", function( settings ) {
		var number = Math.random() * settings.data.min +
			( settings.data.max - settings.data.min );
		settings.error( { data: "is bad" }, { number: number } );
	});
	subscribe( "request.error", function( settings, data, extra ) {
		deepEqual( data, { data: "is bad" }, "error message: data " );
		ok( extra.number > settings.data.min && extra.number < settings.data.max,
			"error message: extra" );
	});
	subscribe( "request.complete", function( settings, data, extra ) {
		deepEqual( data, { data: "is bad" }, "complete message: data " );
		ok( extra.number > settings.data.min && extra.number < settings.data.max,
			"complete message: extra" );
	});

	amplify.request({
		resourceId: "test",
		data: { min: 5, max: 10 },
		error: function( data, extra ) {
			deepEqual( data, { data: "is bad" }, "error callback: data " );
			ok( extra.number > 5 && extra.number < 10,
				"error callback: extra" );
		}
	});
	amplify.request({
		resourceId: "test",
		data: { min: 500, max: 1000 },
		error: function( data, extra ) {
			deepEqual( data, { data: "is bad" }, "error callback: data " );
			ok( extra.number > 500 && extra.number < 1000,
			"error callback: extra" );
		}
	});
});

test( "prevent request", function() {
	expect( 3 );

	amplify.request.define( "test", function( settings ) {
		deepEqual( settings.data, { pass: true }, "request occurred" );
	});
	subscribe( "request.before", function( settings ) {
		ok( true, "message published" );
		return settings.data.pass;
	});
	amplify.request( "test", { pass: false } );
	amplify.request( "test", { pass: true } );
});

module( "amplify.request.define - ajax", lifecycle );

asyncTest( "request( id )", function() {
	expect( 23 );

	var ajax = $.ajax;
	$.ajax = function( settings ) {
		equal( settings.url, "data/data.json", "correct url" );
		equal( settings.dataType, "json", "correct dataType" );
		equal( settings.type, "GET", "default type" );
		ajax.apply( this, arguments );
	};
	amplify.request.define( "test", "ajax", {
		url: "data/data.json",
		dataType: "json"
	});
	subscribe( "request.before", function( settings ) {
		equal( settings.resourceId, "test", "before message: settings.resourceId" );
		deepEqual( settings.data, {}, "before message: settings.data" );
	});
	subscribe( "request.before.ajax", function( resource, settings, ajaxSettings, xhr ) {
		equal( resource.resourceId, "test", "before.ajax message: resource.resourceId" );
		equal( resource.url, "data/data.json", "before.ajax message: resource.url" );
		equal( resource.dataType, "json", "before.ajax message: resource.dataType" );
		equal( resource.type, "GET", "before.ajax message: resource.type" );
		equal( settings.resourceId, "test", "before.ajax message: settings.resourceId" );
		deepEqual( settings.data, {}, "before.ajax message: settings.data" );
		equal( ajaxSettings.url, "data/data.json", "before.ajax message: ajaxSettings.url" );
		equal( ajaxSettings.dataType, "json", "before.ajax message: ajaxSettings.dataType" );
		equal( ajaxSettings.type, "GET", "before.ajax message: ajaxSettings.type" );
		ok( "abort" in xhr, "before.ajax message: xhr object provided" );
	});
	subscribe( "request.success", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "success message: settings.resrouceId" );
		deepEqual( settings.data, {}, "success message: settings.data" );
		deepEqual( data, { foo: "bar" }, "success message: data" );
		ok( "abort" in xhr, "success message: xhr object provided" );
	});
	subscribe( "request.complete", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( settings.data, {}, "complete message: settings.data" );
		deepEqual( data, { foo: "bar" }, "complete message: data" );
		ok( "abort" in xhr, "complete message: xhr object provided" );
		start();
	});
	subscribe( "request.error", function() {
		ok( false, "error message published" );
	});
	amplify.request( "test" );
});

asyncTest( "request( id, fn )", function() {
	expect( 10 );

	amplify.request.define( "test", "ajax", {
		url: "data/data.json",
		dataType: "json"
	});
	subscribe( "request.success", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "success message: settings.resrouceId" );
		deepEqual( settings.data, {}, "success message: settings.data" );
		deepEqual( data, { foo: "bar" }, "success message: data" );
		ok( "abort" in xhr, "success message: xhr object provided" );
	});
	subscribe( "request.complete", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( settings.data, {}, "complete message: settings.data" );
		deepEqual( data, { foo: "bar" }, "complete message: data" );
		ok( "abort" in xhr, "complete message: xhr object provided" );
		start();
	});
	amplify.request( "test", function( data, xhr ) {
		deepEqual( data, { foo: "bar" }, "success callback: data" );
		ok( "abort" in xhr, "success callback: xhr object provided" );
	});
});

asyncTest( "request( id, data, fn )", function() {
	expect( 10 );
	
	amplify.request.define( "test", "ajax", {
		url: "data/echo.php",
		dataType: "json",
		type: "POST"
	});
	subscribe( "request.success", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "success message: settings.resrouceId" );
		deepEqual( settings.data, { open: "source" }, "success message: settings.data" );
		deepEqual( data, { open: "source", echoed: true }, "success message: data" );
		ok( "abort" in xhr, "success message: xhr object provided" );
	});
	subscribe( "request.complete", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( settings.data, { open: "source" }, "complete message: settings.data" );
		deepEqual( data, { open: "source", echoed: true }, "complete message: data" );
		ok( "abort" in xhr, "complete message: xhr object provided" );
		start();
	});
	amplify.request( "test", { open: "source" }, function( data, xhr ) {
		deepEqual( data, { open: "source", echoed: true }, "success callback: data" );
		ok( "abort" in xhr, "success callback: xhr object provided" );
	});
});

asyncTest( "request( hash ) success", function() {
	expect( 8 );

	amplify.request.define( "test", "ajax", {
		url: "data/data.json",
		dataType: "json"
	});
	subscribe( "request.success", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "success message: settings.resrouceId" );
		deepEqual( data, { foo: "bar" }, "success message: data" );
		ok( "abort" in xhr, "success message: xhr object provided" );
	});
	subscribe( "request.complete", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( data, { foo: "bar" }, "complete message: data" );
		ok( "abort" in xhr, "complete message: xhr object provided" );
		start();
	});
	subscribe( "request.error", function() {
		ok( false, "error message published" );
	});
	amplify.request({
		resourceId: "test",
		success: function( data, xhr ) {
			deepEqual( data, { foo: "bar" }, "success callback: data" );
			ok( "abort" in xhr, "success callback: xhr object provided" );
		},
		error: function() {
			ok( false, "error callback invoked" );
		}
	});
});

asyncTest( "request( hash ) error", function() {
	expect( 8 );

	amplify.request.define( "test", "ajax", {
		url: "data/missing.html",
		dataType: "json"
	});
	subscribe( "request.error", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "error message: settings.resrouceId" );
		deepEqual( data, null, "error message: data" );
		ok( "abort" in xhr, "error message: xhr object provided" );
	});
	subscribe( "request.complete", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( data, null, "complete message: data" );
		ok( "abort" in xhr, "complete message: xhr object provided" );
		start();
	});
	subscribe( "request.success", function() {
		ok( false, "success message published" );
	});
	amplify.request({
		resourceId: "test",
		error: function( data, xhr ) {
			deepEqual( data, null, "error callback: data" );
			ok( "abort" in xhr, "error callback: xhr object provided" );
		},
		success: function() {
			ok( false, "success callback invoked" );
		}
	});
});

asyncTest( "prevent request - beforeSend", function() {
	expect( 10 );

	amplify.request.define( "test", "ajax", {
		url: "data/data.json",
		dataType: "json",
		// should execute 2 times
		beforeSend: function( xhr, settings ) {
			ok( "abort" in xhr, "xhr object provided" );
			equal( settings.url.substring( 0, 20 ), "data/data.json?pass=", "correct url" );
			equal( settings.dataType, "json", "correct dataType" );
			return settings.data.substring( settings.data.length - 4 ) === "true";
		}
	});
	// should execute 2 times
	subscribe( "request.before", function( settings ) {
		ok( true, "before message published" );
	});
	// should execute 1 time
	subscribe( "request.before.ajax", function( settings ) {
		ok( true, "before.ajax message published" );
	});
	// should execute 1 time
	subscribe( "request.complete", function( settings ) {
		ok( settings.data.pass, "request completed" );
		start();
	});
	amplify.request( "test", { pass: false } );
	amplify.request( "test", { pass: true } );
});

asyncTest( "prevent request - request.before", function() {
	expect( 3 );

	amplify.request.define( "test", "ajax", {
		url: "data/data.json",
		dataType: "json"
	});
	subscribe( "request.before", function( settings ) {
		ok( true, "message published" );
		return settings.data.pass;
	});
	subscribe( "request.complete", function( settings ) {
		ok( settings.data.pass, "request completed" );
		start();
	});
	amplify.request( "test", { pass: false } );
	amplify.request( "test", { pass: true } );
});

asyncTest( "prevent request - request.before.ajax", function() {
	expect( 3 );
	
	amplify.request.define( "test", "ajax", {
		url: "data/data.json",
		dataType: "json"
	});
	subscribe( "request.before.ajax", function( resouce, settings ) {
		ok( true, "message published" );
		return settings.data.pass;
	});
	subscribe( "request.complete", function( settings ) {
		ok( settings.data.pass, "request completed" );
		start();
	});
	amplify.request( "test", { pass: false } );
	amplify.request( "test", { pass: true } );
});

test( "data merging", function() {
	expect( 3 );

	$.ajax = function( settings ) {
		deepEqual( settings.data, {
			foo: "bar",
			bar: "baz",
			baz: "qux"
		}, "default data passed through" );
	};
	amplify.request.define( "test", "ajax", {
		data: {
			foo: "bar",
			bar: "baz",
			baz: "qux"
		}
	});
	amplify.request( "test" );
	amplify.request( "test", {} );

	$.ajax = function( settings ) {
		deepEqual( settings.data, {
			foo: "changed",
			bar: "baz",
			baz: {
				qux: "remains",
				quux: "is changed"
			}
		}, "data merged" );
	};
	amplify.request.define( "test", "ajax", {
		data: {
			foo: "bar",
			bar: "baz",
			baz: {
				qux: "remains",
				quux: "changes"
			}
		}
	});
	amplify.request( "test", {
		foo: "changed",
		baz: {
			quux: "is changed"
		}
	});
});

test( "url substitution", function() {
	expect( 7 );

	$.ajax = function( settings ) {
		equal( settings.url, "/path/bar", "url" );
		deepEqual( settings.data, {}, "data" );
	};
	amplify.request.define( "test", "ajax", {
		url: "/path/{foo}",
		data: {
			foo: "bar"
		}
	});
	amplify.request( "test" );

	$.ajax = function( settings ) {
		equal( settings.url, "/path/qux", "url" );
		deepEqual( settings.data, {}, "data" );
	};
	amplify.request( "test", { foo: "qux" } );

	$.ajax = function( settings ) {
		equal( settings.url, "/path/bar", "url" );
		deepEqual( settings.data, { qux: "quux" }, "data" );
	};
	amplify.request( "test", { qux: "quux" } );

	$.ajax = function( settings ) {
		equal( settings.url, "/a/bar/b/bar", "url" );
	};
	amplify.request.define( "test", "ajax", {
		url: "/a/{foo}/b/{foo}"
	});
	amplify.request( "test", { foo: "bar" } );
});

asyncTest( "data as string", function() {
	expect( 1 );

	amplify.request.define( "test", "ajax", {
		url: "data/echo-raw.php",
		type: "POST"
	});
	amplify.request( "test", "sending {raw} [data]", function( data ) {
		equal( data, "sending {raw} [data]" );
		start();
	});
});

test( "cache keys", function() {
	expect( 2 );

	equal( amplify.request.cache._key( "x", "" ), "request-x-0" );
	equal( amplify.request.cache._key( "x", "foo=bar" ), "request-x-68033853" );
});

asyncTest( "cache: true", function() {
	expect( 14 );

	var ajaxCalls = 0;
	$( "#ajax-listener" ).ajaxComplete(function( event, xhr ) {
		if ( xhr.statusText !== "abort" ) {
			ok( !ajaxCalls++, "ajax call completed" );
		}
	});
	amplify.request.define( "memory-cache", "ajax", {
		url: "data/data.json",
		dataType: "json",
		cache: true
	});
	// should execute for both requests
	subscribe( "request.before", function( settings ) {
		equal( settings.resourceId, "memory-cache", "before message: settings.resourceId" );
	});
	// should execute for first request only
	subscribe( "request.before.ajax", function( resource ) {
		equal( resource.resourceId, "memory-cache", "before.ajax message: resource.resourceId" );
	});
	// should execute for both requests
	subscribe( "request.success", function( settings, data ) {
		equal( settings.resourceId, "memory-cache", "success message: settings.resourceId" );
		deepEqual( data, { foo: "bar" }, "success message: data" );
	});
	// should execute for both requests
	subscribe( "request.complete", function( settings, data ) {
		equal( settings.resourceId, "memory-cache", "complete message: settings.resourceId" );
		deepEqual( data, { foo: "bar" }, "complete message: data" );
	});
	subscribe( "request.error", function() {
		ok( false, "error message published" );
	});
	amplify.request( "memory-cache", function( data ) {
		deepEqual( data, { foo: "bar" }, "first request callback" );
		amplify.request( "memory-cache", function( data ) {
			deepEqual( data, { foo: "bar" }, "second request callback" );
			start();
		});
	});
});

asyncTest( "cache with data", function() {
	expect( 8 );

	var expectAjax = true;
	amplify.request.define( "data-cache", "ajax", {
		url: "data/echo-raw.php",
		cache: true
	});
	subscribe( "request.before.ajax", function() {
		ok( expectAjax );
	});
	amplify.request( "data-cache", function( data ) {
		equal( data, "empty", "no data; empty cache" );
		amplify.request( "data-cache", { foo: "bar" }, function( data ) {
			equal( data, "foo=bar", "data; empty cache" );
			amplify.request( "data-cache", { foo: "qux" }, function( data ) {
				equal( data, "foo=qux", "different data; empty cache" );
				expectAjax = false;
				amplify.request( "data-cache", { foo: "bar" }, function( data ) {
					equal( data, "foo=bar", "data; cached" );
					amplify.request( "data-cache", function( data ) {
						equal( data, "empty", "no data; cached" );
						start();
					});
				});
			});
		});
	});
});

asyncTest( "cache: Number", function() {
	expect( 22 );
	
	var shouldCache = false;
	$( "#ajax-listener" ).ajaxComplete(function( event, xhr ) {
		if ( xhr.statusText !== "abort" ) {
			ok( !shouldCache, "ajax call completed" );
		}
	});
	amplify.request.define( "cache-duration", "ajax", {
		url: "data/data.json",
		dataType: "json",
		cache: 500
	});
	// should execute for 3 requests
	subscribe( "request.before", function( settings ) {
		equal( settings.resourceId, "cache-duration", "before message: settings.resourceId" );
	});
	// should execute for 2 requests
	subscribe( "request.before.ajax", function( resource ) {
		equal( resource.resourceId, "cache-duration", "before.ajax message: resource.resourceId" );
	});
	// should execute for 3 requests
	subscribe( "request.success", function( settings, data ) {
		equal( settings.resourceId, "cache-duration", "success message: settings.resourceId" );
		deepEqual( data, { foo: "bar" }, "success message: data" );
	});
	// should execute for 3 requests
	subscribe( "request.complete", function( settings, data ) {
		equal( settings.resourceId, "cache-duration", "complete message: settings.resourceId" );
		deepEqual( data, { foo: "bar" }, "complete message: data" );
	});
	subscribe( "request.error", function() {
		ok( false, "error message published" );
	});
	amplify.request( "cache-duration", function( data ) {
		// delay setting the flag because the success callback will be invoked
		// before the ajaxComplete event is triggered
		setTimeout(function() {
			shouldCache = true;
		}, 1 );
		deepEqual( data, { foo: "bar" }, "first request callback" );
		amplify.request( "cache-duration", function( data ) {
			deepEqual( data, { foo: "bar" }, "second request callback" );
		});
		setTimeout(function() {
			shouldCache = false;
			amplify.request( "cache-duration", function( data ) {
				deepEqual( data, { foo: "bar" }, "third request callback" );
				start();
			});
		}, 700 );
	});
});

if ( amplify.store ) {
	asyncTest( "cache: persist", {
		setup: function() {
			$.each( amplify.store(), function( key ) {
				if ( /^request/.test( key ) ) {
					amplify.store( key, null );
				}
			});
		}
	}, function() {
		expect( 14 );

		var ajaxCalls = 0;
		$( "#ajax-listener" ).ajaxComplete(function( event, xhr ) {
			if ( xhr.statusText !== "abort" ) {
				ok( !ajaxCalls++, "ajax call completed" );
			}
		});
		amplify.request.define( "persist-cache", "ajax", {
			url: "data/data.json",
			dataType: "json",
			cache: "persist"
		});
		// should execute for both requests
		subscribe( "request.before", function( settings ) {
			equal( settings.resourceId, "persist-cache", "before message: settings.resourceId" );
		});
		// should execute for first request only
		subscribe( "request.before.ajax", function( resource ) {
			equal( resource.resourceId, "persist-cache", "before.ajax message: resource.resourceId" );
		});
		// should execute for both requests
		subscribe( "request.success", function( settings, data ) {
			equal( settings.resourceId, "persist-cache", "success message: settings.resourceId" );
			deepEqual( data, { foo: "bar" }, "success message: data" );
		});
		// should execute for both requests
		subscribe( "request.complete", function( settings, data ) {
			equal( settings.resourceId, "persist-cache", "complete message: settings.resourceId" );
			deepEqual( data, { foo: "bar" }, "complete message: data" );
		});
		subscribe( "request.error", function() {
			ok( false, "error message published" );
		});
		amplify.request( "persist-cache", function( data ) {
			deepEqual( data, { foo: "bar" }, "first request callback" );
			amplify.request( "persist-cache", function( data ) {
				deepEqual( data, { foo: "bar" }, "second request callback" );
				start();
			});
		});
	});

	test( "cache types", function() {
		$.each( amplify.store.types, function( type ) {
			ok( type in amplify.request.cache, type );
		});
	});
}

asyncTest( "decoder: Function - success", function() {
	expect( 11 );

	amplify.request.define( "test", "ajax", {
		url: "data/data.json",
		dataType: "json",
		decoder: function( data, status, xhr, success, error ) {
			deepEqual( data, { foo: "bar" }, "data in decoder" );
			equal( status, "success", "status in decoder" );
			ok( "abort" in xhr, "xhr in decoder" );
			success({ baz: "qux" });
		}
	});
	subscribe( "request.success", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "success message: settings.resrouceId" );
		deepEqual( data, { baz: "qux" }, "success message: data" );
		ok( "abort" in xhr, "success message: xhr object provided" );
	});
	subscribe( "request.complete", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( data, { baz: "qux" }, "complete message: data" );
		ok( "abort" in xhr, "complete message: xhr object provided" );
		start();
	});
	subscribe( "request.error", function() {
		ok( false, "error message published" );
	});
	amplify.request({
		resourceId: "test",
		success: function( data, xhr ) {
			deepEqual( data, { baz: "qux" }, "success callback: data" );
			ok( "abort" in xhr, "success callback: xhr object provided" );
		},
		error: function() {
			ok( false, "error callback invoked" );
		}
	});
});

asyncTest( "decoder: Function - error", function() {
	expect( 11 );

	amplify.request.define( "test", "ajax", {
		url: "data/data.json",
		dataType: "json",
		decoder: function( data, status, xhr, success, error ) {
			deepEqual( data, { foo: "bar" }, "data in decoder" );
			equal( status, "success", "status in decoder" );
			ok( "abort" in xhr, "xhr in decoder" );
			error({ baz: "qux" });
		}
	});
	subscribe( "request.error", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "error message: settings.resrouceId" );
		deepEqual( data, { baz: "qux" }, "error message: data" );
		ok( "abort" in xhr, "error message: xhr object provided" );
	});
	subscribe( "request.complete", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( data, { baz: "qux" }, "complete message: data" );
		ok( "abort" in xhr, "complete message: xhr object provided" );
		start();
	});
	subscribe( "request.success", function() {
		ok( false, "success message published" );
	});
	amplify.request({
		resourceId: "test",
		success: function() {
			ok( false, "success callback invoked" );
		},
		error: function( data, xhr ) {
			deepEqual( data, { baz: "qux" }, "error callback: data" );
			ok( "abort" in xhr, "error callback: xhr object provided" );
		}
	});
});

asyncTest( "decoder: jsend - success", function() {
	expect( 8 );

	amplify.request.define( "test", "ajax", {
		url: "data/jsend.json",
		dataType: "json",
		decoder: "jsend"
	});
	subscribe( "request.success", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "success message: settings.resrouceId" );
		deepEqual( data, { unwrapped: true }, "success message: data" );
		ok( "abort" in xhr, "success message: xhr object provided" );
	});
	subscribe( "request.complete", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( data, { unwrapped: true }, "complete message: data" );
		ok( "abort" in xhr, "complete message: xhr object provided" );
		start();
	});
	subscribe( "request.error", function() {
		ok( false, "error message published" );
	});
	amplify.request({
		resourceId: "test",
		success: function( data, xhr ) {
			deepEqual( data, { unwrapped: true }, "success callback: data" );
			ok( "abort" in xhr, "success callback: xhr object provided" );
		},
		error: function() {
			ok( false, "error callback invoked" );
		}
	});
});

asyncTest( "decoder: jsend - fail", function() {
	expect( 8 );

	amplify.request.define( "test", "ajax", {
		url: "data/jsend-fail.json",
		dataType: "json",
		decoder: "jsend"
	});
	subscribe( "request.error", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "error message: settings.resrouceId" );
		deepEqual( data, { broken: true }, "error message: data" );
		ok( "abort" in xhr, "error message: xhr object provided" );
	});
	subscribe( "request.complete", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( data, { broken: true }, "complete message: data" );
		ok( "abort" in xhr, "complete message: xhr object provided" );
		start();
	});
	subscribe( "request.success", function() {
		ok( false, "success message published" );
	});
	amplify.request({
		resourceId: "test",
		success: function() {
			ok( false, "success callback invoked" );
		},
		error: function( data, xhr ) {
			deepEqual( data, { broken: true }, "error callback: data" );
			ok( "abort" in xhr, "error callback: xhr object provided" );
		}
	});
});

asyncTest( "decoder: jsend - error", function() {
	expect( 8 );

	amplify.request.define( "test", "ajax", {
		url: "data/jsend-error.json",
		dataType: "json",
		decoder: "jsend"
	});
	subscribe( "request.error", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "error message: settings.resrouceId" );
		deepEqual( data, { message: "it broke" }, "error message: data" );
		ok( "abort" in xhr, "error message: xhr object provided" );
	});
	subscribe( "request.complete", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( data, { message: "it broke" }, "complete message: data" );
		ok( "abort" in xhr, "complete message: xhr object provided" );
		start();
	});
	subscribe( "request.success", function() {
		ok( false, "success message published" );
	});
	amplify.request({
		resourceId: "test",
		success: function() {
			ok( false, "success callback invoked" );
		},
		error: function( data, xhr ) {
			deepEqual( data, { message: "it broke" }, "error callback: data" );
			ok( "abort" in xhr, "error callback: xhr object provided" );
		}
	});
});

asyncTest( "decoder: jsend - error with details", function() {
	expect( 8 );

	amplify.request.define( "test", "ajax", {
		url: "data/jsend-error2.json",
		dataType: "json",
		decoder: "jsend"
	});
	subscribe( "request.error", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "error message: settings.resrouceId" );
		deepEqual( data, {
			message: "it broke",
			code: 15,
			data: { you: "broke", it: "bad" }
		}, "error message: data" );
		ok( "abort" in xhr, "error message: xhr object provided" );
	});
	subscribe( "request.complete", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( data, {
			message: "it broke",
			code: 15,
			data: { you: "broke", it: "bad" }
		}, "complete message: data" );
		ok( "abort" in xhr, "complete message: xhr object provided" );
		start();
	});
	subscribe( "request.success", function() {
		ok( false, "success message published" );
	});
	amplify.request({
		resourceId: "test",
		success: function() {
			ok( false, "success callback invoked" );
		},
		error: function( data, xhr ) {
			deepEqual( data, {
				message: "it broke",
				code: 15,
				data: { you: "broke", it: "bad" }
			}, "error callback: data" );
			ok( "abort" in xhr, "error callback: xhr object provided" );
		}
	});
});

asyncTest( "decoder: custom", function() {
	expect( 11 );

	amplify.request.decoders.silly = function( data, status, xhr, success, error ) {
		deepEqual( data, { foo: "bar" }, "data in decoder" );
		equal( status, "success", "status in decoder" );
		ok( "abort" in xhr, "xhr in decoder" );
		var sillyData = {};
		$.each( data, function( key, value ) {
			sillyData[ "silly-" + key ] = value;
		});
		success( sillyData );
	};
	amplify.request.define( "test", "ajax", {
		url: "data/data.json",
		dataType: "json",
		decoder: "silly"
	});
	subscribe( "request.success", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "success message: settings.resrouceId" );
		deepEqual( data, { "silly-foo": "bar" }, "success message: data" );
		ok( "abort" in xhr, "success message: xhr object provided" );
	});
	subscribe( "request.complete", function( settings, data, xhr ) {
		equal( settings.resourceId, "test", "complete message: settings.resrouceId" );
		deepEqual( data, { "silly-foo": "bar" }, "complete message: data" );
		ok( "abort" in xhr, "complete message: xhr object provided" );
		start();
		delete amplify.request.decoders.silly;
	});
	subscribe( "request.error", function() {
		ok( false, "error message published" );
	});
	amplify.request({
		resourceId: "test",
		success: function( data, xhr ) {
			deepEqual( data, { "silly-foo": "bar" }, "success callback: data" );
			ok( "abort" in xhr, "success callback: xhr object provided" );
		},
		error: function() {
			ok( false, "error callback invoked" );
		}
	});
});

}());
