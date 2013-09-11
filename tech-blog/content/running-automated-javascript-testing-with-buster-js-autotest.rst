running automated javascript testing with buster.js autotest
############################################################
:date: 2012-04-27 10:57
:author: tech_ape
:category: javascript
:tags: buster.js, javascript
:slug: running-automated-javascript-testing-with-buster-js-autotest

This is a demo of the very useful `BusterJS`_ javascript testing
framework that runs under node. It supports multiple ways of testing -
including static, on-demand and autotesting.

This is a video that highlights how it can listen for changes in your
project and run the test suite automatically.

To install buster, do ``npm install -g buster``

To run a buster capture server (where you can attach any device to the
capture interface), run ``buster server`` and then point your browser to
port 1111 on the host that runs it.

Finally, run either ``buster test`` or ``buster autotest`` to start
testing. Couldn't be easier but it makes such a difference to javascript
development.

If you want to play with the code in the video and inspect the actual
tests, you can checkout our mailcheck plugin from my repo here:
``git checkout git://github.com/DimitarChristoff/mailcheck.git``

.. _BusterJS: http://busterjs.org/
