test("FlyJSONP init", function() {
    expect(2);
    
    ok( FlyJSONP.init({debug: true}), "FlyJSONP initialied successfully." );
    ok( FlyJSONP.options.debug, "Debug is turned on as expected." );
});

asyncTest("FlyJSONP cross-domain GET with response", function() {
    expect(1);
    
    FlyJSONP.get({
        url: 'http://storify.com/xdamman.json',
        success: function (data) {
            ok( data, "Got valid reponse" );
        },
        error: function (errorMsg) {
            ok( false, errorMsg );
        },
        complete: function () {
            start();
        }
    });
});

asyncTest("FlyJSONP cross-domain POST with response", function() {
    expect(1);
    
    FlyJSONP.post({
        url: 'http://www.tumblr.com/api/write',
        parameters: {
            email: 'you-email-address',
            password: 'your-password',
            type: 'regular',
            title: 'Test FlyJSONP',
            body: 'Testing it out'
        },
        success: function(data) {
            ok( data, "Got valid reponse" );
        },
        error: function (errorMsg) {
            ok( false, errorMsg );
        },
        complete: function () {
            start();
        }
    });
});


asyncTest("FlyJSONP cross-domain GET with invalid URL", function() {
    expect(1);
    
    FlyJSONP.get({
        url: 'http://invalidurl',
        success: function(data) {
            ok( false, "Got valid reponse" );
        },
        error: function (errorMsg) {
            ok( true, errorMsg );
        },
        complete: function () {
            start();
        }
    });
});

asyncTest("FlyJSONP cross-domain POST with invalid URL", function() {
    expect(1);
    
    FlyJSONP.post({
        url: 'http://invalidurl',
        parameters: {
            data: 'hello'
        },
        success: function(data) {
            ok( false, "Got valid reponse" );
        },
        error: function (errorMsg) {
            ok( true, errorMsg );
        },
        complete: function () {
            start();
        }
    });
});