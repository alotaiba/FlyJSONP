test("FlyJSONP init", function() {
    expect(2);
    
    ok( FlyJSONP.init({debug: true}), "FlyJSONP initialied successfully." );
    ok( FlyJSONP.options.debug, "Debug is turned on as expected." );
});

test("FlyJSONP cross-domain GET with response", function() {
    expect(1);
    
    stop();
    
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

test("FlyJSONP cross-domain POST with response", function() {
    expect(1);
    
    stop();
    
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