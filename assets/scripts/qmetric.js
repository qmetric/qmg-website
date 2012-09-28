
    require.config({
        paths: {
            'mootools': 'lib/mootools',
            'mootools-more': 'lib/mootools-more',
            'domReady': 'lib/domReady'
        },
        shim: {
            'mootools': {
               exports: 'MooTools'
            },
            'mootools-more': {
               deps: ['mootools'],
               exports: function(MooTools) {
                   return MooTools.More
               }
            }
        },
        urlArgs: "bust=" +  (new Date()).getTime()
    });

    require(['domReady', 'modules/TermsLoader', 'modules/MqShowHide'], function(domReady, TermsLoader, MqShowHide) {

        domReady(function() {

            var event = ('ontouchstart' in document.documentElement ? 'touchstart:relay(li > a)' : 'click:relay(li > a)');
            var scroller = new Fx.Scroll(window);
            new TermsLoader('.footer-links', '.hdr-terms-main > a');

            document.getElement('.date-year').set('text', new Date().getFullYear());
            document.getElement('.primary-nav').addEvent(event, function(event, element) {
                var id = element.get('href').split('#')[1];
                scroller.toElement(id, 'y');
                event.preventDefault();
            });

            new MqShowHide('#nav', '.primary-nav', {
                trigger: {
                    injectPos: 'top',
                    type: 'a',
                    text: 'Show navigation',
                    altText: 'Hide navigation',
                    attr: {
                        'class': 'btn-nav-toggle',
                        href: '#'
                    }
                },
                wrapper: {
                    attr: {
                        'class': 'nav-toggle-container'
                    }
                }
            }).hide();

        });

    });
