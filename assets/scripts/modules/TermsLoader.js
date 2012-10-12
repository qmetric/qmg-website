
    define(function(require) {
        require('mootools');
        
        return new Class({
            
            Implements: [Options, Events],
            
            options: {
                siblingSelector: '.terms-body' ,
                loadingClass: 'term-loading',
                toggleClass: 'is-term-visible'
            },
            
            initialize: function(container, selector, options) {
                this.container = document.getElement(container);
                this.selector = selector;
                this.setOptions(options);
                
                this.container.addEvent(['click:relay(', this.selector, ')'].join(''), function(event, element) {
                    var termContainer = element.getParent().getSiblings(this.options.siblingSelector)[0];

                    // Don't load the content more than once
                    (termContainer.getChildren().length > 0) ?
                        termContainer.toggleClass(this.options.toggleClass) :
                        this.loadTerm(element, termContainer);

                    event.preventDefault();
                }.bind(this));
            },
            
            loadTerm: function(element, termContainer) {
                var that = this;

                new Request({
                    url: element.get('href'),
                    onRequest: function() {
                        termContainer.toggleClass(that.options.loadingClass);
                    },
                    onSuccess: function(responseText) {
                        termContainer.set('html', responseText);
                        termContainer.toggleClass(that.options.loadingClass);
                    }
                }).send();

                termContainer.toggleClass(this.options.toggleClass);
            }
            
        })
    });
