
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
               exports: function(MooTools) {
                   return MooTools.More
               }
            }
        },
        urlArgs: "bust=" +  (new Date()).getTime()
    });

    // Find out current media query from CSS ftw
    define('mq', function() {
        return function() {
            return window.getComputedStyle(document.body,':after').getPropertyValue('content');
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
        'mq',
        'lib/address-bar',
        'lib/orientation-fix'
    ], function(domReady, TermsLoader, MqShowHide, mq, addressBar, orientationFix) {

        domReady(function() {

            var event = ('ontouchstart' in document.documentElement ? 'touchstart:relay(li > a)' : 'click:relay(li > a)');
            new TermsLoader('.footer-links', '.hdr-terms-main > a');

            document.getElement('.date-year').set('text', new Date().getFullYear());

            addressBar();
            orientationFix();

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

            // Load google maps if above phone
            if (mq().indexOf('tablet-small') == -1 && mq().indexOf('phone') == -1) {
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
