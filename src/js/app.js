(function($) {
    var app = $.sammy('#dynamic', function() {
        var templatesFolder = 'templates/';
        this.use('Mustache');
        
        this.notFound = function(verb, path) {
            this.runRoute('get', '#!/404');
        };
        
        this.get('/', function() {
            this.partial(templatesFolder + 'index.mustache')
            .then(function(){
                this.trigger('done-loading-template');
            });
        });
        
        this.get('#!/start', function() {
            this.partial(templatesFolder + 'start.mustache')
            .then(function(){
                this.trigger('done-loading-template');
            });
        });

        this.get('#!/demo', function() {
            var templateVars = {
                url: {
                    value: 'http://storify.com/xdamman.json'
                },
                method: {
                    get: 'selected'
                },
                callback: {
                    value: 'callback'
                },
                parameters: [
                    {
                        key: 'limit',
                        value: 5
                    }
                ]
            };
            this.renderDemo(templateVars);
        });
        
        this.get('#!/demo-get-tweets', function() {
            var templateVars = {
                url: {
                    value: 'https://api.twitter.com/1/statuses/user_timeline.json'
                },
                method: {
                    get: 'selected'
                },
                callback: {
                    value: 'callback'
                },
                parameters: [
                    {
                        key: 'include_rts',
                        value: true
                    },
                    {
                        key: 'screen_name',
                        value: 'alotaiba'
                    },
                    {
                        key: 'count',
                        value: 2
                    }
                ]
            };
            this.renderDemo(templateVars);
        });
        
        this.get('#!/demo-get-reddit', function() {
            var templateVars = {
                url: {
                    value: 'http://www.reddit.com/.json'
                },
                method: {
                    get: 'selected'
                },
                callback: {
                    value: 'jsonp'
                },
                parameters: [
                    {
                        key: 'limit',
                        value: 5
                    }
                ]
            };
            this.renderDemo(templateVars);
        });
        
        this.get('#!/demo-get-flickr', function() {
            var templateVars = {
                url: {
                    value: 'http://api.flickr.com/services/feeds/photos_public.gne'
                },
                method: {
                    get: 'selected'
                },
                callback: {
                    value: 'jsoncallback'
                },
                parameters: [
                    {
                        key: 'format',
                        value: 'json'
                    }
                ]
            };
            this.renderDemo(templateVars);
        });
        
        this.get('#!/demo-post-story', function() {
            var templateVars = {
                url: {
                    value: 'http://storify.com/story/new'
                },
                method: {
                    post: 'selected'
                },
                parameters: [
                    {
                        key: 'username',
                        value: 'your-user-name'
                    },
                    {
                        key: 'api_key',
                        value: 'your-api-key'
                    },
                    {
                        key: 'title',
                        value: 'FlyJSONP'
                    },
                    {
                        key: 'description',
                        value: 'Testing it out'
                    }
                ]
            };
            this.renderDemo(templateVars);
        });
        
        this.get('#!/demo-post-tumblr', function() {
            var templateVars = {
                url: {
                    value: 'http://www.tumblr.com/api/write'
                },
                method: {
                    post: 'selected'
                },
                parameters: [
                    {
                        key: 'email',
                        value: 'your-email'
                    },
                    {
                        key: 'password',
                        value: 'your-password'
                    },
                    {
                        key: 'type',
                        value: 'regular'
                    },
                    {
                        key: 'title',
                        value: 'Test FlyJSONP'
                    },
                    {
                        key: 'body',
                        value: 'Testing it out'
                    }
                ]
            };
            this.renderDemo(templateVars);
        });
        
        this.get('#!/404', function() {
            this.partial(templatesFolder + '404.mustache')
            .then(function(){
                this.trigger('done-loading-template');
            });
        });
        
        this.post('#!/fetch', function() {
            this.trigger('form-submit');
        });
        
        this.helpers({
            jsonLeafType: function (value, key) {
                var data,
                    stringValue,
                    containsChildren = false;
                    
                if (value === null) {
                    data = {'title': key + ' : null', 'attr': {href: 'javascript:;', 'data-type': 'null', 'data-name': key, 'data-value': 'null'}};
                } else if (typeof value === 'string') {
                    data = {'title': key + ' : "' + value + '"', 'attr': {href: 'javascript:;', 'data-type': 'string', 'data-name': key, 'data-value': value}};
                } else if (typeof value === 'number') {
                    data = {'title': key + ' : ' + value, 'attr': {href: 'javascript:;', 'data-type': 'number', 'data-name': key, 'data-value': value}};
                } else if (typeof value === 'boolean') {
                    stringValue = value ? 'true' : 'false';
                    data = {'title': key + ' : ' + stringValue, 'attr': {href: 'javascript:;', 'data-type': 'boolean', 'data-name': key, 'data-value': stringValue}};
                } else if (typeof value === 'object') {
                    containsChildren = true;
                    stringValue = 'Object';
                    if (value instanceof Array) {
                        stringValue = 'Array';
                    }
                    data = {'title': key, 'attr': {href: 'javascript:;', 'data-type': stringValue, 'data-name': key, 'data-value': stringValue}};
                } else if (typeof value === 'function') {
                    data = {'title': key + ' : function', 'attr': {href: 'javascript:;', 'data-type': 'function', 'data-name': key, 'data-value': 'function'}};
                }
                
                return {
                    data: data,
                    containsChildren: (containsChildren === true) ? containsChildren : false
                }
            },
            jsonToTree: function (obj) {
                var newjsondata = [];
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var leaf = this.jsonLeafType(obj[key], key);
                        if (leaf.containsChildren === true) {
                            newjsondata.push({data: leaf.data, children: this.jsonToTree(obj[key])});
                        } else {
                            newjsondata.push({data: leaf.data});
                        }
                    }
                }
                return newjsondata;
            },
            renderDemo: function(templateVars) {
                this.partial(templatesFolder + 'demo.mustache', templateVars)
                .then(function(content){
                    this.trigger('form_update_fieldAddRemove');
                    this.trigger('done-loading-template');
                });
            },
            flyJSONP: function(url, method, callbackParameter, parameters) {
                var context = this;
                var data = {
                    url: url,
                    parameters: parameters,
                    success: function(data) {
                        context.updateResultsTree(data);
                    },
                    error: function(error) {
                        $("#result_jsonp").text(error);
                    }
                };
                if (method == 'get') {
                    data.callbackParameter = callbackParameter;
                    FlyJSONP.get(data);
                } else if (method == 'post') {
                    FlyJSONP.post(data);
                }
            },
            updateResultsTree: function(json) {
                //jsondata = context.jsonToTree(data);
                var jsondata;
                if (typeof (json) === 'object') {
                    jsondata = this.jsonToTree(json);
                } else {
                    jsondata = {data: {'title': json, 'attr': {href: 'javascript:;', 'data-type': typeof (json), 'data-name': 'N/A', 'data-value': json}}};
                }
                $("#result_jsonp").jstree({
                    "themes": {
                        icons: false
                    },
                    "core": {
                        "animation": 0
                    },
                    "json_data" : {
                        "data" : jsondata,
                        "progressive_render" : false
                    },
                    "plugins" : [ "themes", "json_data", "ui" ]
                })
                .delegate("a", "click", function (event) {
                    var data = $(event.target).data();
                    app.trigger('jsonp_view_item_info', data);
                    event.preventDefault();
                });
            }
        });
        
        this.bind('run', function(e, data) {
            $('#form_method select').live('change', function(e){
                app.trigger('form_select_method_change', {element: $(this)});
            });
            
            $('#form_parameters .removeFormField').live('click', function(e){
                app.trigger('form_remove_parameter_field');
            });
            
            $('#form_parameters .addFormField').live('click', function(e){
                app.trigger('form_add_parameter_field');
            });
            
            $("#expand_all_link").live('click', function (e) {
                app.trigger('jsonp_view_expand_all');
            });
            
            $("#collapse_all_link").live('click', function (e) {
                app.trigger('jsonp_view_collapse_all');
            });
        });
        
        this.bind('form_select_method_change', function(e, data) {
            var selectedValue = data.element.find(":selected").val();
            (selectedValue == 'post') ? $('#form_callback').hide() : $('#form_callback').show();
        });
        
        this.bind('form_add_parameter_field', function(e, data) {
            var newFieldDOM = $('<div/>')
                .attr({'class': 'grid_8 alpha params_fields'})
                .html('<div class="grid_3 alpha">'
              		+'<input type="text" id="keys" name="keys[]" placeholder="Key" required />'
            		+'</div>'
            		+'<div class="grid_1">'
              		+'<p style="font-size: 1.6em; text-align: center">=</p>'
            		+'</div>'
            		+'<div class="grid_3">'
              		+'<input type="text" id="values" name="values[]" placeholder="Value" required />'
            		+'</div>'
            		+'<div class="grid_1 omega fieldsAddRemove"></div>');
            var newClearDOM = $('<div/>')
                .attr({'class': 'clear'});
            $('#form_parameters_fields').append(newFieldDOM).append(newClearDOM);
            app.trigger('form_update_fieldAddRemove');
        });
        
        this.bind('form_remove_parameter_field', function(e, data) {
            var parametersDOM = $('.params_fields');
            if (parametersDOM.length > 1) {
                $(event.target).closest('.params_fields').remove();
            }
            app.trigger('form_update_fieldAddRemove');
        });
        
        this.bind('form_update_fieldAddRemove', function(e, data) {
            var fieldAddRemoveDOM;
            var parametersDOM = $('.params_fields');
            parametersDOM.find('.fieldsAddRemove').empty();
            if (parametersDOM.length == 1) {
                fieldAddRemoveDOM = parametersDOM.first().find('.fieldsAddRemove');
                fieldAddRemoveDOM.html('<p style="font-size: 1.6em;"><a class="addFormField" href="javascript:;">+</a></p>');
            } else {
                parametersDOM.each(function(i, el){
                    var element = $(el).find('.fieldsAddRemove');
                    element.html('<p style="font-size: 1.6em;"><a class="removeFormField" href="javascript:;">-</a></p>')
                });
                fieldAddRemoveDOM = parametersDOM.last().find('.fieldsAddRemove');
                fieldAddRemoveDOM.html('<p style="font-size: 1.6em;"><a class="removeFormField" href="javascript:;">-</a><a class="addFormField" href="javascript:;">+</a></p>');
            }
        });
        
        this.bind('jsonp_view_expand_all', function(e, data) {
            $("#result_jsonp").jstree("open_all", false);
        });
        
        this.bind('jsonp_view_collapse_all', function(e, data) {
            $("#result_jsonp").jstree("close_all", false);
        });
        
        this.bind('jsonp_view_item_info', function(e, data) {
            $.each(data, function(key, value){
                $('.data_' + key + '_value').text(value);
            });
        });
        
        this.bind('done-loading-template', function(e, data) {
            prettyPrint();
        });
        
        this.bind('form-submit', function(e, data) {
            //TODO: need to check for old browsers https://github.com/ryanseddon/H5F
            var formFields = this.params;
            var context = this;
            
            $('#result_jsonp').text('Loading data...');
            
            var url = formFields['url'];
            var method = formFields['method'];
            var callbackParameter = formFields['callback'];
            var keys = (typeof (formFields['keys[]']) === 'string') ? [formFields['keys[]']] : formFields['keys[]'];
            var values = (typeof (formFields['values[]']) === 'string') ? [formFields['values[]']] : formFields['values[]'];
            var parameters = {};
            $.each(keys, function(i, val){
                parameters[val] = values[i];
            });
            this.flyJSONP(url, method, callbackParameter, parameters);
            //console.log($.param(form_fields.toHash()));
        });
        
    });

    $(function() {
        FlyJSONP.init({debug: false});
        app.run();
    });
})(jQuery);