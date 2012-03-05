// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){
    
    window.FirstOperand = Backbone.Model.extend({
        defaults: function() { 
            return { 
                value: 0,
                isSet: false
            }
        }
    });
    window.FirstOperandI = new FirstOperand;
    
    window.SecondOperand = Backbone.Model.extend({
        defaults: function() { 
            return { 
                value: 0,
                isSet: false
            }
        }
    });
    window.SecondOperandI = new SecondOperand;
    
    window.Result = Backbone.Model.extend({
        defaults: function() { 
            return { 
                value: '',
                isSet: false
            }
        }
    });
    window.ResultI = new Result;
    
    window.KeyModel = Backbone.Model.extend({
        defaults: function() { 
            return { 
                value: 0
            }
        }
    });
    
    window.Key = Backbone.View.extend({
        
        events: {
            "click": "pressKey"
            // TODO
        },
        
        pressKey: function(){
            var key = this.model.get('value');
            console.log(key);
            console.log(ResultI.get('value') + key.toString());
            ResultI.set('value', ResultI.get('value') + key);
        }
        
    });
    
    var configureKey = function(suffix){
        new Key(
            {
                el:  $('#b' + suffix.toString()),
                model: new KeyModel({value: suffix})
            }
        ); 
    };
    
    _.each(_.range(0, 9), function(i){
        configureKey(i);
    });
    
    configureKey('00');
    
    window.Screen = Backbone.View.extend({
        
        el:  $('#screen'),
        
        model: Result,
        
        events: {
            // TODO
        },
        
        initialize: function() {
            this.model.on('change', this.render, this);
        },
        
        render: function() {
            $el.value(this.model.get('value'));
            return this;
        }
        
    });

    // Finally, we kick things off by creating the **App**.
//    window.App = new AppView;

});
