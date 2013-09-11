Automating JavaScript CI with buster.js and TravisCI
####################################################
:date: 2012-07-06 13:53
:author: tech_ape
:category: javascript, mootools
:tags: buster.js, testing, travis-ci
:slug: automating-javascript-ci-with-buster-js-and-travisci

Having something like `BusterJS <http://busterjs.org/>`_ test coverage is pretty awesome but
sometimes, you want to add automated CI testing as well. This is when
`Travis CI <http://travis-ci.org/>`_ can come into play - a brilliant platform for continuous
integration testing on open source projects on github.

We added it to `Epitome <https://github.com/DimitarChristoff/Epitome/>`_ and it now has a shiny new 'badge' on the
README.md that says:

So, how do you go about adding CI to your project?

Travis CI works on top of nodejs for JavaScript testing, so before you
begin, you need to define your project in a ``package.json``.

In Epitome's case, the file is very simple and looks like this:

::

    {
        "author" : "DimitarChristoff",
        "contributors": [
            {
                "name": "Dimitar Christoff",
                "email": "christoff@gmail.com"
            },
            {
                "name": "Simon Smith",
                "email": "ssmith@qmetric.co.uk"
                
            },
            {
                "name": "Garrick Cheung",
                "email": "garrick@garrickcheung.com"
            },
            {
                "name": "Chiel Kunkels",
                "email": "ckunkels@qmetric.co.uk"
            }
        ],
        "name" : "epitome",
        "description" : "Epitome MV* for MooTools",
        "version" : "0.0.1",
        "scripts" : {
            "test" : "node_modules/.bin/buster-test"
        },
        "repository": {
            "type": "git",
            "url": "https://github.com/DimitarChristoff/Epitome"
        },
        "keywords": [
            "mootools",
            "epitome",
            "mvc"
        ],
        "main": "./build/Epitome.js",
        "license": "MIT",
        "devDependencies" : {
            "buster" : "~0.6.0"
        },
        "engines" : {
            "node" : "~0.6"
        }
    }

Basically, the only real dependency required to run things is buster.js
and we want the newest 0.6.0 version.

Once you have created the file, you may want to test it by running
``npm install .`` which should bring busterjs into ``~/node_modules``.
You should add **node\_modules/\*** to your **.gitignore** file.

To test that everything is working locally, first start your
``buster-server`` as you would normally:

::

    dchristoff@Dimitars-iMac:~/Projects/Epitome (master):
    > buster server &
    [1] 64510
    dchristoff@Dimitars-iMac:~/Projects/Epitome (master):
    > buster-server running on http://localhost:1111

Now, attach a browser if you need to or don't (if you have node-only
unit tests). Then try to see if it works:

::

    dchristoff@Dimitars-iMac:~/Projects/Epitome (master):
    > npm test

    > Epitome@0.0.1 test /Users/dchristoff/projects/Epitome
    > node_modules/.bin/buster-test

    Firefox 13.0.1, OS X 10.7 (Lion): ................................................................................ 
                                      ..                                                                               
    9 test cases, 82 tests, 82 assertions, 0 failures, 0 errors, 0 timeouts
    Finished in 0.973s

Your tests should pass. You are halfway there! Next step is, go to the
`Travis CI <http://travis-ci.org/>`_ website and login with your github account. Pick your
repository form the list and enable CI on it, this will install a commit
hook and enable the integration.

To define how Travis should work and test your project, we need a simple
YAML file called .travis.yml:

::

    before_script:
      - export DISPLAY=:99.0
      - sh -e /etc/init.d/xvfb start
      - sleep 5
      - node_modules/.bin/buster-server &
      - sleep 5
      - firefox http://localhost:1111/capture &
      - sleep 5


    script:
      - "npm test"

    language: node_js

    node_js:
      - 0.6

Basically, you are saying: we want to use X-server (exports display),
start the capture server and fork it in the background, then launch
firefox on the capture URL and wait for 5 more seconds. The sleep time
is a little ambiguous and fragile but there seems to be no event that
can confirm the success of launching and capture.

When done, it will run ``npm test``. That's it! What happens afterwards
when you commit is very simple: Travis will clone your repo, parse the
YML file, run npm install to get deps (buster) and run the test script.
If it exits with code 0, your build is considered a success.

Here is how it looks on the Travis console:


... Then a lot of submodule fetching until:

You can actually see the last build status on the Travis site by going
`here <http://travis-ci.org/#!/DimitarChristoff/Epitome/builds/1794500>`__

See what tests we actually run `here <https://github.com/DimitarChristoff/Epitome/tree/master/test>`__.

Good luck and have fun coding in the knowledge that your tests will
always run, no matter what. Now if only there was something that could
write the tests for you...

