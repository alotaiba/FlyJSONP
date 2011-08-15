## Overview
FlyJSONP is a small JavaScript library, that allows you to do cross-domain `GET` and `POST` requests with remote services that support `JSONP`, and get a `JSON` response. Have a look at the demo to see it in action, or check out get started guide for usage instructions, and examples.

* Demo: [https://alotaiba.github.com/FlyJSONP/#!/demo](https://alotaiba.github.com/FlyJSONP/#!/demo)
* Guide: [https://alotaiba.github.com/FlyJSONP/#!/start](https://alotaiba.github.com/FlyJSONP/#!/start)
* Documentation: [https://github.com/alotaiba/FlyJSONP/wiki](https://github.com/alotaiba/FlyJSONP/wiki)

## Features
* Cross-domain `GET`, as well as `POST` requests, with `JSON` response. `POST` requests pass through [YQL](http://developer.yahoo.com/yql/).
* Control over the callback parameter name for `GET` requests.
* No other dependency on other JavaScript frameworks.

## Quick Usage Guide
To get started, first download FlyJSONP, and add it to your code. Then simply call `init` method to setup the initial options.

    <script src="/path/to/flyjsonp.js"></script>
    <script>
    FlyJSONP.init({debug: true});
    </script>

### GET Request
To issue a cross-domain `GET` request, you call the `get` method. It accepts number of options, and calls `success` callback when provided, with `JSON` response.

    FlyJSONP.get({
      url: 'http://storify.com/xdamman.json',
      success: function (data) {
        console.log(data);
      },
      error: function (errorMsg) {
        console.log(errorMsg);
      }
    });

### POST Request
To issue a cross-domain `POST` request, you call the `post` method. It accepts number of options, and calls `success` callback when provided, with `JSON` response. To get around cross-domain issues for `POST` requests, FlyJSONP uses YQL to send the request and retrieve the response.

    FlyJSONP.post({
      url: 'http://storify.com/story/new',
      parameters: {
        username: 'your-username',
        api_key: 'secret-api-key',
        title: 'FlyJSONP',
        description: 'Testing it out'
      },
      success: function(data) {
        console.log(data);
      }
    });
    
## License
FlyJSONP is a project of Abdulrahman Al-Otaiba, the project is released under the GNU GPLv3 license. See LICENSE for more details.

## Thanks
I would like to thank the following people, and give them credit for their awesome work:

* Johannes Charman - For creating YQL data table 'jsonpost'
* Christian Heilmann - For creating YQL data table 'htmlpost'