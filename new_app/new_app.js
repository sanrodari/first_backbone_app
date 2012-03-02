// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){
    
    window.Item = Backbone.Model.extend({
        
        value: ''
        
    });

    window.ItemList = Backbone.Collection.extend({
        
        model: Item,
        
        localStorage: new Store("items")
        
    });

    
    window.Items = new ItemList;

    // The element for a item...
    window.ItemView = Backbone.View.extend({

        tagName:  "li",

        // Cache the template function for a single item.
        template: _.template($('#item-template').html()),

        // The DOM events specific to an item.
        events: {
            "click .item a": "clear"
        },

        // The TodoView listens for changes to its model, re-rendering.
        initialize: function() {
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
        },

        // Re-render the contents of the todo item.
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },

        // Remove this view from the DOM.
        remove: function() {
            $(this.el).remove();
        },

        // Remove the item, destroy the model.
        clear: function() {
            this.model.destroy();
        }

    });

    // The Application
    // ---------------

    // Our overall **AppView** is the top-level piece of UI.
    window.AppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: $("#app"),

        // Our template for the line of statistics at the bottom of the app.
        statsTemplate: _.template($('#summary-template').html()),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "keypress #input-new-item":  "createOnEnter"
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function() {
            this.input = this.$("#input-new-item");

            Items.bind('add',   this.addOne, this);
            Items.bind('reset', this.addAll, this);
            Items.bind('all',   this.render, this);

            Items.fetch();
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render: function() {
            this.$('#todo-stats').html(this.statsTemplate({
                total: Items.length
            }));
        },

        // Add a single todo item to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne: function(item) {
            var view = new ItemView({
                model: item
            });
            $("#items").append(view.render().el);
        },

        // Add all items in the **Todos** collection at once.
        addAll: function() {
            Items.each(this.addOne);
        },

        // If you hit return in the main input field, and there is text to save,
        // create new **Todo** model persisting it to *localStorage*.
        createOnEnter: function(e) {
            var text = this.input.val();
            if (!text || e.keyCode != 13) return;
            Items.create({
                value: text
            });
            this.input.val('');
        }

    });

    // Finally, we kick things off by creating the **App**.
    window.App = new AppView;

});
