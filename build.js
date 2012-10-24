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

    dir: 'assets/scripts.min',
    modules: [
        {
            name: 'qmetric',
            include: ['async']
        },
        {
            name: 'mobile'
        },
        {
            name: 'modules/ScrollSpy',
            exclude: ['mootools']
        },
        {
            name: 'modules/Carousel',
            exclude: ['mootools']
        }
    ]
})
