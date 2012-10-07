
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
        }
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
        'lib/address-bar',
        'lib/orientation-fix'
    ], function(domReady, TermsLoader, MqShowHide, addressBar, orientationFix) {

        domReady(function() {

            new TermsLoader('.footer-links', '.hdr-terms-main > a');
            addressBar();
            orientationFix();

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

        });

    });
