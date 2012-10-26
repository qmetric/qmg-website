// Request these modules again because IE 7-8 don't
// support media queries in the matchMedia polyfill
// https://github.com/scottjehl/Respond/issues/82#issuecomment-2873389

require(['modules/Carousel'], function(Carousel) {
    new Carousel('#who-we-are .fixed-width', '.content');
});

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
