Working with Legacy Code: A Pragmatic Approach
##############################################
:date: 2012-09-09 14:44
:author: tech_ape
:category: agile
:tags: agile, brittle, code, legacy, pragmatism, refactoring
:slug: working-with-legacy-code-a-pragmatic-approach

Having the opportunity to work on so-called 'greenfield' projects is not
something everyone can boast about. In fact, we will surely be
surrounded by legacy software throughout the majority of our long
careers. It is almost a certainty that you will at some point come up
against software systems that are difficult to change or grow and evolve
and that is simply the nature of software development.

The term 'legacy' itself is an oft misunderstood concept. Legacy code,
in its `official definition <http://en.wikipedia.org/wiki/Legacy_code>`_, is code that is used "for the purpose
of maintaining an older or previously supported feature". Legacy code
can often be seen in a system where typically only a few know how it
works. The term itself can be used to describe these things above but as
you make your journey through various jobs, it will start to have it's
own underlying connotations.

Within the context of a mature software organization where the next
generation of developers have outnumbered the original authors of the
legacy systems, there are often negative undertones associated with
legacy systems. The musings of a few freshly hired developers when they
speak of legacy code, might be interpreted to mean, obsolete or
irrelevant code that was written before their time. To put it more
succinctly, legacy code is code that they didn't write (and is obviously
less superior). This kind of short-sighted thinking leads many to
abandon legacy systems entirely, regardless of what value they bring or
what revenues they generate.

However, there are always pragmatic ways to deal with these problems. In
large legacy systems that are inherently brittle due to their age and
complexity, the ideas behind being 'agile' lend themselves nicely to the
dedicated effort of self-improvement. People will frequently advocate
incremental refactorings, but that comes with the implied notion that
there is no tangible end to the battle. Incremental refactorings follow
the notion of the Broken Window theory: leave things in better shape
than you found it. While this practice is a great way to *maintain* a
level of code quality, it is not effective approach for building on
completely new features.

A couple of ThoughtWorkers went through an exercise where they were
asked to deliver brand new features on an old, brittle system and rather
than wrestle with that system, they went about it in a more novel
way [#thoughtworkers]_. Rather than spending a few months (or undoubtedly
years) to understand an undocumented system and re-write it's core
logic, they looked at the new features to build as a whole new system.
This approach takes on what is sometimes lovingly referred to as the
'wrap the crap' approach.

Essentially, we take what the system does now and leave it alone. Let it
continue to do as it normally does without any further support. Any new
interactions with that system must be done through an adapter or façade
layer. This layer will 'wrap' the legacy system providing a thin
transformation of data and encapsulating the details of the legacy
system. This may be something like exchanging an obsolete transport
protocol (RMI) with a more universally accepted one (REST over HTTP). Or
it could mean abstracting out a convoluted messaging protocol (SOAP)
with a more standardized one (JSON).

As software professionals, we've often condoned the shortcuts used to to
endure 'one more change' within a legacy system. While this is the
quicker way to do get things done in the short-term, it should be no
surprise to most of us that all it really does is create Instant Legacy
Code™. Using this approach of retiring the older legacy systems through
abstraction in an adapter layer means that your next new features can be
just as rewarding as working on brand new mini-greenfield projects.
Business owners will rarely accept an entire rewrite of a system, but
they would surely be more agreeable to maintaing business as usual
operations while progressively building for the next generation.

**References**
~~~~~~~~~~~~~~

.. rubric:: Footnotes

.. [#thoughtworkers] `An Agile Approach to a Legacy System <http://tech.qmetric.co.uk/wp-content/uploads/2012/09/an-agile-approach-to-a-legacy-system.pdf>`_, ThoughtWorks Inc.
