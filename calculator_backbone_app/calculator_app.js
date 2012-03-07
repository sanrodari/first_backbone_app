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
    
    window.OperatorModel = Backbone.Model.extend({
        defaults: {
            value: ''
        }
    });
    window.CurrentOperator = new OperatorModel;
    
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
        },
        
        pressKey: function(){
            var key = this.model.get('value');
            ResultI.set('value', ResultI.get('value').toString() + key);
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
    
    _.each(_.range(0, 10), function(i){
        configureKey(i);
    });
    
    configureKey('00');
    
    var operateF = function(){
            var operator = this.model.get('value');
            
            var oldOperator = CurrentOperator.get('value');
            CurrentOperator.set('value', operator);
            
            if(!FirstOperandI.get('isSet')){
                FirstOperandI.set('value', ResultI.get('value'));
                FirstOperandI.set('isSet', true);
            }
            else if(!SecondOperandI.get('isSet')){
                SecondOperandI.set('value', ResultI.get('value'));
                SecondOperandI.set('isSet', true);
            }
            
            // If both operands are set
            else {
                FirstOperandI.set('value', SecondOperandI.get('value'));
                SecondOperandI.set('value', ResultI.get('value'));
            }
            
            ResultI.set('value', '');
            
            if(oldOperator !== '' && FirstOperandI.get('isSet') && SecondOperandI.get('isSet')){
                var first = parseInt(FirstOperandI.get('value'));
                var second = parseInt(SecondOperandI.get('value'));
                
                var total;
                
                switch(oldOperator){
                    case '+':
                        total = first + second;
                        break;
                    case '-':
                        total = first - second;
                        break;
                    case '*':
                        total = first * second;
                        break;
                    case '/':
                        total = first / second;
                        break;
                    case '%':
                        total = first * (second / 100);
                        break;
                }
                
                ResultI.set('value', total);
            }
        } 
    
    window.Operator = Backbone.View.extend({
        model: OperatorModel,
        
        events: {
            'click': 'operate'
        },
        
        operate: operateF
        
    });
    
    window.EqualButton = new Operator({
        el: $('#b-equal'),
        
        model: new OperatorModel({value: '='})
    });
    
    window.PlusOperator = new Operator({
        el: $('#b-plus'),
        
        model: new OperatorModel({value: '+'})
    });
    
    window.MinusOperator = new Operator({
        el: $('#b-minus'),
        
        model: new OperatorModel({value: '-'})
    });
    
    window.MultiplyOperator = new Operator({
        el: $('#b-multiply'),
        
        model: new OperatorModel({value: '*'})
    });
    
    window.DivideOperator = new Operator({
        el: $('#b-divide'),
        
        model: new OperatorModel({value: '/'})
    });
    
    window.PercentageOperator = new Operator({
        el: $('#b-percentage'),
        
        model: new OperatorModel({value: '%'})
    });
    
    window.Clear = Backbone.View.extend({
        events: {
            'click': 'clear'
        },
        
        clear: function(){
            FirstOperandI.set('isSet', false);
            FirstOperandI.set('value', '');
            
            SecondOperandI.set('isSet', false);
            SecondOperandI.set('value', '');
            
            ResultI.set('value', '');
        }
        
    });
    window.ClearI = new Clear({el: $('#b-clear')});
    
    window.Screen = Backbone.View.extend({
        
        el:  $('#screen'),
        
        events: {
            // TODO
        },
        
        initialize: function() {
            this.model.on('change', this.render, this);
        },
        
        render: function() {
            this.$el.val(this.model.get('value'));
            return this;
        }
        
    });

    window.ScreenI = new Screen({model: ResultI});

});
