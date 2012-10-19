// https://github.com/jrburke/r.js/blob/master/build/example.build.js
({
    baseUrl: 'assets/scripts/',
    /*paths: {
        'mootools': 'lib/mootools',
        'mootools-more': 'lib/mootools-more',
        'domReady': 'lib/domReady',
        'async': 'lib/async'
    },*/
    mainConfigFile: './assets/scripts/qmetric.js',

    optimize: 'uglify',
    preserveLicenseComments: false,
    uglify: {
        max_line_length: 3500,
        no_copyright: true
    },

    out: 'assets/scripts/qmetric.min.js',
    name: 'qmetric',
    include: ['async']
})
