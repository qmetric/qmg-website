    /**
     * A really quick n dirty carousel just for the two item carousels on this site
     * Built it in a rush ;)
     */

    define(function(require) {

        require('mootools');

        return new Class({

            Implements: [Options, Events],

            options: {
                navPos: 'bottom'
            },

            initialize: function(container, items, options) {
                this.container = document.getElement(container);
                this.items = this.container.getElements(items);
                this.items[1].addClass('fade-out');
                this.setOptions(options);

                this.addNav();
            },

            fadeToggle: function(event) {
                this.items.toggleClass('fade-out');
                event && event.preventDefault();
            },

            addNav: function() {
                var events = {
                    click: this.fadeToggle.bind(this)
                };

                var navContainer = new Element('div.carousel-nav');
                var next = new Element('button.btn-next[text=Next]', { events: events });
                var prev = new Element('button.btn-prev[text=Previous]', { events: events });

                navContainer.adopt(prev, next);
                navContainer.inject(this.container, this.options.navPos);
            }

        });

    });
