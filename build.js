// https://github.com/jrburke/r.js/blob/master/build/example.build.js
({
    baseUrl: 'assets/scripts/',
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
