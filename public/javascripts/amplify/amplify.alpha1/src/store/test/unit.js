module( "amplify.store" );

test( "Built-in storage types", function() {
	expect( 6 );
	equal( "localStorage" in amplify.store.types,
		"localStorage" in window, "localStorage" );
	try {
		equal( "sessionStorage" in amplify.store.types,
			"sessionStorage" in window, "sessionStorage" );
	} catch( e ) {
		equal( "sessionStorage" in amplify.store.types,
			false, "sessionStorage" );
	}
	equal( "globalStorage" in amplify.store.types, "globalStorage" in window,
		"globalStorage" );
	equal( "userData" in amplify.store.types,
		"addBehavior" in $( "<div>" )[0], "userData" );
	equal( "memory" in amplify.store.types, true, "memory" );
	equal( "cookie" in amplify.store.types, $.support.cookie, "cookie" );
});

test( "amplify.store.addType", function() {
	expect( 10 );
	var testStore,
		store = function( key, value ) {
			return testStore.apply( this, arguments );
		};
	amplify.store.addType( "custom", store );
	equal( amplify.store.types.custom, store, "custom store added" );

	testStore = function( key, value ) {
		equal( key, "foo", "getter key" );
		equal( value, undefined, "getter value" );
		return "bar";
	};
	equal( amplify.store.custom( "foo" ), "bar", "getter" );
	testStore = function( key, value ) {
		equal( key, "foo", "setter key" );
		equal( value, "baz", "setter value" );
		return value;
	};
	equal( amplify.store.custom( "foo", "baz" ), "baz", "setter" );
	equal( amplify.store( "foo", "baz", { type: "custom" } ), "baz",
		"setter via options" );
});

if ( "localStorage" in amplify.store.types ) {
	module( "amplify.store.localStorage", {
		setup: function() {
			$.each( amplify.store.localStorage(), function( key ) {
				amplify.store.localStorage( key, null );
			});
		}
	});

	test( "localStorage", function() {
		expect( 9 );
		deepEqual( amplify.store.localStorage(), {}, "empty store" );
		equal( amplify.store.localStorage( "foo" ), undefined, "get; miss" );
		equal( amplify.store.localStorage( "foo", "bar" ), "bar", "set" );
		equal( amplify.store.localStorage( "foo" ), "bar", "get" );
		deepEqual( amplify.store.localStorage( "baz", { qux: "quux" } ),
			{ qux: "quux" }, "set object" );
		deepEqual( amplify.store.localStorage( "baz" ), { qux: "quux" }, "get object" );
		deepEqual( amplify.store.localStorage(),
			{ foo: "bar", baz: { qux: "quux" } }, "get all" );
		equal( amplify.store.localStorage( "foo", null ), null, "delete" );
		equal( amplify.store.localStorage( "foo" ), undefined, "deleted" );
	});

	asyncTest( "localStorage expiration", function() {
		expect( 4 );
		amplify.store.localStorage( "expiring1", "i disappear",
			{ expires: 300 } );
		amplify.store.localStorage( "expiring2", "i disappear too",
			{ expires: 600 } );
		deepEqual( amplify.store.localStorage(), {
			expiring1: "i disappear",
			expiring2: "i disappear too"
		}, "values with expiration exist" );
		setTimeout(function() {
			equal( amplify.store.localStorage( "expiring1" ), undefined,
				"300 expired" );
			equal( amplify.store.localStorage( "expiring2" ), "i disappear too",
			"600 still valid" );
		}, 450 );
		setTimeout(function() {
			deepEqual( amplify.store.localStorage(), {}, "both expired" );
			start();
		}, 700 );
	});
}

if ( "sessionStorage" in amplify.store.types ) {
	module( "amplify.store.sessionStorage", {
		setup: function() {
			$.each( amplify.store.sessionStorage(), function( key ) {
				amplify.store.sessionStorage( key, null );
			});
		}
	});

	test( "sessionStorage", function() {
		expect( 9 );
		deepEqual( amplify.store.sessionStorage(), {}, "empty store" );
		equal( amplify.store.sessionStorage( "foo" ), undefined, "get; miss" );
		equal( amplify.store.sessionStorage( "foo", "bar" ), "bar", "set" );
		equal( amplify.store.sessionStorage( "foo" ), "bar", "get" );
		deepEqual( amplify.store.sessionStorage( "baz", { qux: "quux" } ),
				{ qux: "quux" }, "set object" );
		deepEqual( amplify.store.sessionStorage( "baz" ), { qux: "quux" }, "get object" );
		deepEqual( amplify.store.sessionStorage(),
				{ foo: "bar", baz: { qux: "quux" } }, "get all" );
		equal( amplify.store.sessionStorage( "foo", null ), null, "delete" );
		equal( amplify.store.sessionStorage( "foo" ), undefined, "deleted" );
	});

	asyncTest( "sessionStorage expiration", function() {
		expect( 4 );
		amplify.store.sessionStorage( "expiring1", "i disappear",
			{ expires: 300 } );
		amplify.store.sessionStorage( "expiring2", "i disappear too",
			{ expires: 600 } );
		deepEqual( amplify.store.sessionStorage(), {
			expiring1: "i disappear",
			expiring2: "i disappear too"
		}, "values with expiration exist" );
		setTimeout(function() {
			equal( amplify.store.sessionStorage( "expiring1" ), undefined,
				"300 expired" );
			equal( amplify.store.sessionStorage( "expiring2" ), "i disappear too",
			"600 still valid" );
		}, 450 );
		setTimeout(function() {
			deepEqual( amplify.store.sessionStorage(), {}, "both expired" );
			start();
		}, 700 );
	});
}

if ( "globalStorage" in amplify.store.types ) {
	module( "amplify.store.globalStorage", {
		setup: function() {
			$.each( amplify.store.globalStorage(), function( key ) {
				amplify.store.globalStorage( key, null );
			});
		}
	});

	test( "globalStorage", function() {
		expect( 9 );
		deepEqual( amplify.store.globalStorage(), {}, "empty store" );
		equal( amplify.store.globalStorage( "foo" ), undefined, "get; miss" );
		equal( amplify.store.globalStorage( "foo", "bar" ), "bar", "set" );
		equal( amplify.store.globalStorage( "foo" ), "bar", "get" );
		deepEqual( amplify.store.globalStorage( "baz", { qux: "quux" } ),
			{ qux: "quux" }, "set object" );
		deepEqual( amplify.store.globalStorage( "baz" ), { qux: "quux" }, "get object" );
		deepEqual( amplify.store.globalStorage(),
			{ foo: "bar", baz: { qux: "quux" } }, "get all" );
		equal( amplify.store.globalStorage( "foo", null ), null, "delete" );
		equal( amplify.store.globalStorage( "foo" ), undefined, "deleted" );
	});

	asyncTest( "globalStorage expiration", function() {
		expect( 4 );
		amplify.store.globalStorage( "expiring1", "i disappear",
			{ expires: 300 } );
		amplify.store.globalStorage( "expiring2", "i disappear too",
			{ expires: 600 } );
		deepEqual( amplify.store.globalStorage(), {
			expiring1: "i disappear",
			expiring2: "i disappear too"
		}, "values with expiration exist" );
		setTimeout(function() {
			equal( amplify.store.globalStorage( "expiring1" ), undefined,
				"300 expired" );
			equal( amplify.store.globalStorage( "expiring2" ), "i disappear too",
			"600 still valid" );
		}, 450 );
		setTimeout(function() {
			deepEqual( amplify.store.globalStorage(), {}, "both expired" );
			start();
		}, 700 );
	});
}

if ( "userData" in amplify.store.types ) {
	module( "amplify.store.userData", {
		setup: function() {
			$.each( amplify.store.userData(), function( key ) {
				amplify.store.userData( key, null );
			});
		}
	});

	test( "userData", function() {
		expect( 9 );
		deepEqual( amplify.store.userData(), {}, "empty store" );
		equal( amplify.store.userData( "foo" ), undefined, "get; miss" );
		equal( amplify.store.userData( "foo", "bar" ), "bar", "set" );
		equal( amplify.store.userData( "foo" ), "bar", "get" );
		deepEqual( amplify.store.userData( "baz", { qux: "quux" } ),
			{ qux: "quux" }, "set object" );
		deepEqual( amplify.store.userData( "baz" ), { qux: "quux" }, "get object" );
		deepEqual( amplify.store.userData(),
			{ foo: "bar", baz: { qux: "quux" } }, "get all" );
		equal( amplify.store.userData( "foo", null ), null, "delete" );
		equal( amplify.store.userData( "foo" ), undefined, "deleted" );
	});

	asyncTest( "userData expiration", function() {
		expect( 4 );
		amplify.store.userData( "expiring1", "i disappear",
			{ expires: 300 } );
		amplify.store.userData( "expiring2", "i disappear too",
			{ expires: 600 } );
		deepEqual( amplify.store.userData(), {
			expiring1: "i disappear",
			expiring2: "i disappear too"
		}, "values with expiration exist" );
		setTimeout(function() {
			equal( amplify.store.userData( "expiring1" ), undefined,
				"300 expired" );
			equal( amplify.store.userData( "expiring2" ), "i disappear too",
			"600 still valid" );
		}, 450 );
		setTimeout(function() {
			deepEqual( amplify.store.userData(), {}, "both expired" );
			start();
		}, 700 );
	});
}

module( "amplify.store.memory", {
	setup: function() {
		$.each( amplify.store.memory(), function( key ) {
			amplify.store.memory( key, null );
		});
	}
});

test( "memory", function() {
	expect( 9 );
	deepEqual( amplify.store.memory(), {}, "empty store" );
	equal( amplify.store.memory( "foo" ), undefined, "get; miss" );
	equal( amplify.store.memory( "foo", "bar" ), "bar", "set" );
	equal( amplify.store.memory( "foo" ), "bar", "get" );
	deepEqual( amplify.store.memory( "baz", { qux: "quux" } ),
		{ qux: "quux" }, "set object" );
	deepEqual( amplify.store.memory( "baz" ), { qux: "quux" }, "get object" );
	deepEqual( amplify.store.memory(),
		{ foo: "bar", baz: { qux: "quux" } }, "get all" );
	equal( amplify.store.memory( "foo", null ), null, "delete" );
	equal( amplify.store.memory( "foo" ), undefined, "deleted" );
});

asyncTest( "memory expiration", function() {
	expect( 4 );
	amplify.store.memory( "expiring1", "i disappear",
		{ expires: 300 } );
	amplify.store.memory( "expiring2", "i disappear too",
		{ expires: 600 } );
	deepEqual( amplify.store.memory(), {
		expiring1: "i disappear",
		expiring2: "i disappear too"
	}, "values with expiration exist" );
	setTimeout(function() {
		equal( amplify.store.memory( "expiring1" ), undefined,
			"300 expired" );
		equal( amplify.store.memory( "expiring2" ), "i disappear too",
		"600 still valid" );
	}, 450 );
	setTimeout(function() {
		deepEqual( amplify.store.memory(), {}, "both expired" );
		start();
	}, 700 );
});

if ( "cookie" in amplify.store.types ) {
	module( "amplify.store.cookie", {
		setup: function() {
			var paths = [ "" ];
			$.each( window.location.pathname.substr( 1 ).split( "/" ), function( i, path ) {
				paths.push( paths[ paths.length - 1 ] + "/" + path );
			});
			paths[ 0 ] = "/";

			$.each( $.cookie(), function( key ) {
				$.each( paths, function( i, path ) {
					$.cookie( key, null, { path: path } );
				});
			});
		}
	});

	test( "cookie", function() {
		expect( 9 );
		deepEqual( amplify.store.cookie(), {}, "empty store" );
		equal( amplify.store.cookie( "foo" ), undefined, "get; miss" );
		equal( amplify.store.cookie( "foo", "bar" ), "bar", "set" );
		equal( amplify.store.cookie( "foo" ), "bar", "get" );
		deepEqual( amplify.store.cookie( "baz", { qux: "quux" } ),
			{ qux: "quux" }, "set object" );
		deepEqual( amplify.store.cookie( "baz" ), { qux: "quux" }, "get object" );
		deepEqual( amplify.store.cookie(),
			{ foo: "bar", baz: { qux: "quux" } }, "get all" );
		equal( amplify.store.cookie( "foo", null ), null, "delete" );
		equal( amplify.store.cookie( "foo" ), undefined, "deleted" );
	});
}

// we use higher delays with cookies because we can't get fine-grained control
// due to the browser using its own timers
asyncTest( "cookie expiration", function() {
	expect( 4 );
	amplify.store.cookie( "expiring1", "i disappear",
		{ expires: 2000 } );
	amplify.store.cookie( "expiring2", "i disappear too",
		{ expires: 4000 } );
	deepEqual( amplify.store.cookie(), {
		expiring1: "i disappear",
		expiring2: "i disappear too"
	}, "values with expiration exist" );
	setTimeout(function() {
		equal( amplify.store.cookie( "expiring1" ), undefined,
			"2000 expired" );
		equal( amplify.store.cookie( "expiring2" ), "i disappear too",
		"4000 still valid" );
	}, 2500 );
	setTimeout(function() {
		deepEqual( amplify.store.cookie(), {}, "both expired" );
		start();
	}, 4500 );
});
