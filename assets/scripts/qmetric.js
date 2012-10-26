
    require.config({
        paths: {
            'mootools': 'lib/mootools',
            'mootools-more': 'lib/mootools-more',
            'domReady': 'lib/domReady',
            'async': 'lib/async'
        },
        shim: {
            'mootools': {
                exports: 'MooTools'
            },
            'mootools-more': {
                deps: ['mootools'],
                exports: 'MooTools.More',
                init: function(MooTools) {
                    return MooTools.More
                }
            }
        },
        urlArgs: "bust=" +  (new Date()).getTime()
    });

    // Create Google Maps module - http://blog.millermedeiros.com/requirejs-2-0-delayed-module-evaluation-and-google-maps/
    define('gmaps', ['async!http://maps.googleapis.com/maps/api/js?key=AIzaSyC4a-g88iFrG8-uar7IrboJAPPvNOonGuw&sensor=true'], function() {
        return window.google.maps;
    });

    // Loading modules for the site begins here!
    require([
        'domReady',
        'modules/TermsLoader',
        'modules/MqShowHide'
    ], function(domReady, TermsLoader, MqShowHide) {

        domReady(function() {

            new TermsLoader('.footer-links', '.hdr-terms-main');

            var scroll = new Fx.Scroll(window, {
                duration: 800,
                offset: {
                    y: -75
                }
            });
            document.getElement('.site-header').addEvent('click:relay(.site-title a, .primary-nav a)', function(event) {
                var target = this.get('href').split('#')[1];
                scroll.toElement(target);
                event.preventDefault();
            });

            document.getElement('.date-year').set('text', new Date().getFullYear());

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

            // Load gmaps above phone and small tablet
            if (Modernizr.mq('(min-width: 46.875em)')) {
                require(['gmaps'], function(gmaps) {
                    var latlng = new gmaps.LatLng(51.51442, -0.07771);
                    var mapElement = document.getElementById('google-map');

                    var map = new gmaps.Map(mapElement, {
                        zoom: 16,
                        center: latlng,
                        mapTypeId: gmaps.MapTypeId.ROADMAP
                    });

                    new gmaps.Marker({
                        position: latlng,
                        map: map
                    });
                });
            }

            // Close the nav after item selected (phone only)
            if (!Modernizr.mq('(min-width: 37.5em)')) {
                var navContainer = document.getElement('.nav-toggle-container');
                document.getElement('.primary-nav').addEvent('click:relay(a)', function() {
                    navContainer.hide();
                });
            }

            if (Modernizr.mq('(min-width: 78.125em)')) {
                require(['modules/Carousel'], function(Carousel) {
                    new Carousel('#who-we-are .fixed-width', '.content');
                    new Carousel('#our-brands .fixed-width', '.carousel-item');
                });
            }

        });

        // Some mobile/tablet specific stuff
        if (Modernizr.mq('(max-width: 64em)')) {
            require(['mobile']);
        }

    });
