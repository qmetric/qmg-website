
    define(function(require) {
        require('mootools');
        
        return new Class({
            
            Implements: [Options, Events],
            
            options: {
                siblingSelector: '.term-container' ,
                loadingClass: 'term-loading',
                toggleClass: 'is-term-visible'
            },
            
            initialize: function(container, selector, options) {
                this.container = document.getElement(container);
                this.selector = selector;
                this.termContainers = document.getElements(this.options.siblingSelector);
                this.setOptions(options);

                this.attachEvents();
            },

            attachEvents: function() {
                this.container.addEvent('click:relay(button.term-close)', this.closeTerms.bind(this));

                document.body.addEvent('keyup', function(event) {
                    if ( event.key === 'esc' ) {
                        this.closeTerms();
                    }
                }.bind(this));

                this.container.addEvent(['click:relay(', this.selector, ')'].join(''), function(event, element) {
                    var termContainer = element.getSiblings(this.options.siblingSelector)[0];
                    this.hideOtherContainers(termContainer);

                    // Don't load the content more than once
                    if (termContainer.getChildren().length > 0) {
                        termContainer.toggleClass(this.options.toggleClass)
                    } else {
                        this.loadTerm(element, termContainer);
                    }

                    element.toggleClass('active');
                    event.preventDefault();
                }.bind(this));
            },

            closeTerms: function(event) {
                this.termContainers.removeClass(this.options.toggleClass);
                this.container.getElement('.active').removeClass('active');
                event && event.preventDefault();
            },

            hideOtherContainers: function(termContainer) {
                var filtered = Array.filter(this.termContainers, function(item) {
                    return item !== termContainer;
                });

                new Elements(filtered).each(function(elem) {
                    elem.removeClass(this.options.toggleClass);
                    elem.getSiblings().removeClass('active');
                }, this);
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
