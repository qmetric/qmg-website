#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'tech@qmetric.co.uk'
SITENAME = u'QMetric Tech Blog'
SITEURL = ''

TIMEZONE = 'Europe/Paris'

DEFAULT_LANG = u'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

# Blogroll
LINKS =  (('QMetric', 'http://qmetric.co.uk/'),
          ('PolicyExpert', 'http://policyexpert.co.uk/'),)

# Social widget
#SOCIAL = (('Test','#'),)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

THEME = "/home/ec2-user/website/theme"
#THEME = "/home/ec2-user/pelican-themes/html5-dopetrope"

STATIC_PATHS = (['pe-game'])
