/*
 * FlyJSONP v0.2
 * http://alotaiba.github.com/FlyJSONP
 * 
 * FlyJSONP is a small JavaScript library, that allows you to do
 * cross-domain GET and POST requests with remote services that support
 * JSONP, and get a JSON response.
 * 
 * Copyright (c) 2011 Abdulrahman Al-Otaiba
 * Dual-licensed under MIT and GPLv3.
 */

var FlyJSONP = (function (global) {
    "use strict";
    /*jslint bitwise: true*/
    var self,
        addEvent,
        garbageCollectGet,
        parametersToString,
        generateRandomName,
        callError,
        callSuccessGet,
        callSuccessPost,
        callComplete;
    
    addEvent = function (element, event, fn) {
        if (element.addEventListener) {
            element.addEventListener(event, fn, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, fn);
        } else {
            element['on' + event] = fn;
        }
    };
    
    garbageCollectGet = function (callbackName, script) {
        self.log("Garbage collecting!");
        script.parentNode.removeChild(script);
        global[callbackName] = undefined;
        try {
            delete global[callbackName];
        } catch (e) { }
    };
    
    parametersToString = function (parameters, encodeURI) {
        var str = "",
            key,
            parameter;
            
        for (key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                key = encodeURI ? encodeURIComponent(key) : key;
                parameter = encodeURI ? encodeURIComponent(parameters[key]) : parameters[key];
                str += key + "=" + parameter + "&";
            }
        }
        return str.replace(/&$/, "");
    };
    
    //Thanks to Kevin Hakanson
    //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/873856#873856
    generateRandomName = function () {
        var uuid = '',
            s = [],
            hexDigits = "0123456789ABCDEF",
            i = 0;
            
        for (i = 0; i < 32; i += 1) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        
        s[12] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01

        uuid = 'flyjsonp_' + s.join("");
        return uuid;
    };
    
    callError = function (callback, errorMsg) {
        self.log(errorMsg);
        if (typeof (callback) !== 'undefined') {
            callback(errorMsg);
        }
    };
    
    callSuccessGet = function (callback, data) {
        self.log("GET success");
        if (typeof (callback) !== 'undefined') {
            callback(data);
        }
        self.log(data);
    };
    
    callSuccessPost = function (callback, data) {
        self.log("POST success");
        if (typeof (callback) !== 'undefined') {
            callback(data);
        }
        self.log(data);
    };
    
    callComplete = function (callback) {
        self.log("Request complete");
        if (typeof (callback) !== 'undefined') {
            callback();
        }
    };
    
    self = {};
    
    //settings
    self.options = {
        debug: false
    };
    
    self.init = function (options) {
        var key;
        self.log("Initializing!");
        
        for (key in options) {
            if (options.hasOwnProperty(key)) {
                self.options[key] = options[key];
            }
        }
        
        self.log("Initialization options");
        self.log(self.options);
        return true;
    };
    
    self.log = function (log) {
        if (global.console && self.options.debug) {
            global.console.log(log);
        }
    };
    
    self.get = function (options) {
        options = options || {};
        var url = options.url,
            callbackParameter = options.callbackParameter || 'callback',
            parameters = options.parameters || {},
            script = global.document.createElement('script'),
            callbackName = generateRandomName(),
            prefix = "?";
            
        if (!url) {
            throw new Error('URL must be specified!');
        }
        
        parameters[callbackParameter] = callbackName;
        if (url.indexOf("?") >= 0) {
            prefix = "&";
        }
        url += prefix + parametersToString(parameters, true);
        
        global[callbackName] = function (data) {
            if (typeof (data) === 'undefined') {
                callError(options.error, 'Invalid JSON data returned');
            } else {
                if (options.httpMethod === 'post') {
                    data = data.query.results;
                    if (!data || !data.postresult) {
                        callError(options.error, 'Invalid JSON data returned');
                    } else {
                        if (data.postresult.json) {
                            data = data.postresult.json;
                        } else {
                            data = data.postresult;
                        }
                        callSuccessPost(options.success, data);
                    }
                } else {
                    callSuccessGet(options.success, data);
                }
            }
            garbageCollectGet(callbackName, script);
            callComplete(options.complete);
        };
        
        self.log("Getting JSONP data");
        script.setAttribute('src', url);
        global.document.getElementsByTagName('head')[0].appendChild(script);
        
        addEvent(script, 'error', function () {
            garbageCollectGet(callbackName, script);
            callComplete(options.complete);
            callError(options.error, 'Error while trying to access the URL');
        });
    };
    
    self.post = function (options) {
        options = options || {};
        var url = options.url,
            parameters = options.parameters || {},
            yqlQuery,
            yqlURL,
            getOptions = {};
        
        if (!url) {
            throw new Error('URL must be specified!');
        }
        
        yqlQuery =  encodeURIComponent('select * from jsonpost where url="' + url + '" and postdata="' + parametersToString(parameters, false) + '"');
        yqlURL = 'http://query.yahooapis.com/v1/public/yql?q=' + yqlQuery + '&format=json' + '&env=' + encodeURIComponent('store://datatables.org/alltableswithkeys');
        
        getOptions.url = yqlURL;
        getOptions.httpMethod = 'post';
        
        if (typeof (options.success) !== 'undefined') {
            getOptions.success = options.success;
        }
        
        if (typeof (options.error) !== 'undefined') {
            getOptions.error = options.error;
        }
        
        if (typeof (options.complete) !== 'undefined') {
            getOptions.complete = options.complete;
        }
        
        self.get(getOptions);
    };
    
    return self;
}(this));