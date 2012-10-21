
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
            },
            'modules/ScrollSpy': {
                deps: ['mootools'],
                exports: 'moostrapScrollspy'
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
        'modules/MqShowHide',
        'modules/ScrollSpy',
        'lib/address-bar',
        'lib/orientation-fix'
    ], function(domReady, TermsLoader, MqShowHide, ScrollSpy, addressBar, orientationFix) {

        domReady(function() {

            new TermsLoader('.footer-links', '.hdr-terms-main');
            new ScrollSpy('nav', {
                activeClass: 'nav-active',
                offset: -90
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

            // Load Google Maps above phone and small tablet
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
            
            if (!Modernizr.mq('(min-width: 37.5em)')) {
                var navContainer = document.getElement('.nav-toggle-container');
                document.getElement('.primary-nav').addEvent('click:relay(a)', function(event) {
                    navContainer.hide();
                });
            }

        });

        // Mobile stuffs
        if (/mobile/i.test(navigator.userAgent)) {
            addressBar();
        }
        if (navigator.userAgent.match(/(iPad|iPhone|iPod)/i)) {
            orientationFix();
        }

    });
