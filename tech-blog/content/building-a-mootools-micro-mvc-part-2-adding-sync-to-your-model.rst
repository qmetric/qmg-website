Building a MooTools micro MVC, part 2: Adding sync to your model
################################################################
:date: 2012-06-08 14:20
:author: tech_ape
:category: javascript, mootools
:tags: Epitome, mootools, MVC, tutorial
:slug: building-a-mootools-micro-mvc-part-2-adding-sync-to-your-model

.. raw:: html

   <div class="alert">

**This is a `MooTools`_ JavaScript library tutorial**
Difficulty: moderate
Skill: intermediate+
Requires: Prior knowledge of javascript, MooTools and MooTools Classes
Read: `Part 1: Creating your own MVC-like data model class in MooTools`_

.. raw:: html

   </div>

.. raw:: html

   <div class="alert alert-info">

**UPDATE:** This tutorial is now hosted in its own GitHub repository
called `Epitome`_. You can view the Groc documentation of the class on
the gh-pages branch `here`_. Please ignore the attempts to modularise it
for AMD/CJS as this is very much work-in-progress. To run the
``example/model-demo-sync.html``, you need the project to reside within
a web server as it relies on the XHR subsystem. A sample PHP script is
provided that returns a JSON object and a mod\_rewrite rule in .htaccess
is added so that it can work with REST-like URLs.

.. raw:: html

   </div>

In our previous installment, we covered the basics of the creation of a
simple Model class that can allow you to have managed data key->value
pairs with appropriate events and exports.

You can view the base Model class in its entirety (as it was before this
installment) here: `https://tinker.io/beceb`_ (out of date)

Better yet, look at it on `github`_ instead!

As a side note, if we ever need to change or update Epitome, GitHub is
the only source that guarantees to be up-to date, trying to keep blog
posts, jsfiddle and tinker.io examples current is not exactly fun.

Today, we will try to take this further by making sure the Model can
synchronize with the server RESTfully. To do so, we need to first design
some spec to work against.

-  Go with the API already established in Backbone etc - add a
   ``.sync(mode, model, options)`` method to the Model prototype
-  Each model now NEEDS to have an \`ID\`
-  The model needs to have a single Request instance so we get no
   versioning issues
-  Each model now needs to have a \`urlRoot\` that points to the server
   REST api
-  Export CRUD methods on the model proto so it can work as
   ``Model.read()`` etc.
-  Define custom accessors so that \`urlRoot\` does not go in the model
   but is usable

So, where to begin? `By creating our buster tests`_. To make them pass,
there are many patterns available we can use. The most obvious one is to
simply add the new method ``sync`` (because everyone else does) to the
prototype of the Model class and make it available to all Models. I
don't particularly like this solution (even if it's the easiest), as I
often work with Models that are for display only and need not be sync'd.

Pattern #2 would be to create a new object with the method definitions
and then Implement that into the model prototype or the model instance
itself. Although this is more modular and flexible, it's subject to a
specially constructed object literal with **\`mutator\`** keys like
**\`before\`**, **\`after\`** and so forth.

Pattern #3 can be using something like a proper Class Mutator. A
**\`Class mutator\`** is basically a specially crafted constructor
object key that can change how the Class is being constructed. Eg. ones
are **Extends**, **Implements** and **Binds** (from mootools-more). You
could add something like **\`Syncs: [Storage, Sync]\`** - though it's
not easy to write, adds a footprint to Class and does not offer good
readibility as there is little to indicate how important such a key
really is.

Pattern #4 is what we will write instead, because it's the most
MooToolsy (tm). We will create a new Class called **Model.sync** that
**Extends Model**. Easy as pie...

To start off, we need to define a small map of CRUD to normal GET/POST.
Keep in mind that the MooTools Request class already `exports all that
is good`_ so any Request instance supports ``instance.delete()`` and so
forth. We will use that and copy the pattern into our own class. You can
store that in a closure or put it on an existing object for convenience.

javascript

::

    // define CRUD mapping.
    Model.methodMap = {
        create: 'POST',
        read: 'GET',
        update: 'PUT',
        delete: 'DELETE'
    };

That's that. It will know what to call and the Model will have the nice
methods instead. Now onto creating the Class. If you have never extended
a mootools class, it's easy, we start with the skeleton:

javascript

::

    Model.sync = new Class({
        
        Extends: Model,

        initialize: function(obj, options) {
            // needs to happen first before events are added,
            // in case we have custom accessors in the model object.        
            this.setupSync();
            this.parent(obj, options);
        }
    });

It's fairly self explanatory - we define a new constructor function
(aka, Class) that will call on the Model one but when the \`initialize\`
function runs, it will also call our new method \`setupSync\`.

Reviewing our specification, before we write more code, we need to
ensure that we cover the 2 special cases we now have to do with the
model \`id\` and \`urlRoot\` properties. We do so by using our custom
properties accessors and add them to the new prototype:

javascript

::

    Model.sync = new Class({
        
        Extends: Model,

        properties: {
            id: {
                get: function() {
                    // always need an id, even if we don't have one.
                    return this._attributes.id || (this._attributes.id = String.uniqueID());
                }
            },
            urlRoot: {
                // normal convention - not in the model!
                set: function(value) {
                    this.urlRoot = value;
                },
                get: function() {
                    // make sure we return a sensible url.
                    var base = this.urlRoot || this.options.urlRoot || 'no-urlRoot-set';
                    base.charAt(base.length - 1) != '/' && (base += '/');
                    return base;
                }
            }
        },

        options: {
            // by default, HTTP emulation is enabled for mootools request class. we want it off.
            emulateREST: false
        },

        initialize: ...

We have now ensured that any ``model.get('id');`` will always return an
id. Though this may not be the smartest decision in terms of recovery
when no ID is set, but it guarantees uniqueness of the data model. If
you ever want to make the sync to be to say, **localStorage** or
**sessionStorage** or **window.name** instead, even a fake ID will come
in handy in occluding your data.

We have also prevented ``model.set('urlRoot', '/something/')`` from ever
making it to the actual data model. We also define a getter for the
urlRoot that ensures it has a trailing \`/\` because we will likely be
appending the model Id after the URL when syncing.

Next up. Add the method that creates the Request instance (we call that
in the initialize):

javascript

::

    setupSync: function() {
        var self = this,
            rid = 0,
            incrementRequestId = function() {
                // request ids are unique and private. private function to up them.
                rid++;
            };

        // public methods - next likely is current rid + 1
        this.getRequestId = function() {
            return rid + 1;
        };

        this.request = new Request.JSON({
            // one request at a time
            link: 'chain',
            url: this.get('urlRoot'),
            emulation: this.options.emulateREST,
            onRequest: incrementRequestId,
            onCancel: function() {
                this.removeEvents('sync:' + rid);
            },
            onSuccess: function(responseObj) {
                self.fireEvent('sync', [responseObj, this.options.method, this.options.data]);
                self.fireEvent('sync:' + rid, [responseObj]);
            },
            onFailure: function() {
                self.fireEvent('sync:error', [this.options.method, this.options.url, this.options.data]);
            }
        });


        // export crud methods to model.
        Object.each(methodMap, function(requestMethod, protoMethod) {
            self[protoMethod] = function(model, options) {
                this.sync(protoMethod, model, options);
            };
        });

        return this;
    } 

Essentially, nothing too special - created our request instance and also
exposed **.create()**, **.read()**, **.update()** and **.delete()** as
methods that are available on the model itself, passing on arguments to
**.sync()**.

Although these methods give you low-level access to sync stuff, you need
to rely on scripting and events to do something with the data. You may
want to API that with something like a **.fetch()** and **.save()**
pair, but it hardly is necessary to add such specificity.

In order to overload these into the sync method but have method-specific
events, we will create a little helper method first that will add a
one-off event and then self-remove:

javascript

::

    _throwAwaySyncEvent: function(eventName, callback) {
        // a pseudo :once event for each sync that sets the model to response and can do more callbacks.

        // normally, methods that implement this will be the only ones to auto sync the model to server version.
        eventName = eventName || 'sync:' + this.getRequestId();

        var self = this,
            throwAway = {};

        throwAway[eventName] = function(responseObj) {
            if (responseObj && typeof responseObj == 'object') {
                self.set(responseObj);
                callback && callback.apply(self, responseObj);
            }

            // remove this one-off event.
            self.removeEvents(throwAway);
        };

        return this.addEvents(throwAway);
    }.protect()

Now, the actual fetch.

javascript

::

    fetch: function() {
        // perform a .read and then set returned object key/value pairs to model.
        this._throwAwaySyncEvent('sync:' + this.getRequestId(), function() {
            this.fireEvent('fetch');
            this.isNewModel = false;
        });
        this.read();

        return this;
    }   

Keep in mind that this example may or may not suit your needs. For
starters, you may have a model with the following object stored:

::

    {
        foo: 'bar'
    }

And the fetch may return:

::

    {
        bar: 'foo'
    }

Your model will just get a new key 'bar' with the value of 'foo' - it
won't suddenly get rewritten to the new value from the server. Any
values that have changed will change on your model and fire a 'onChange'
event as you would expect. Just keep it in mind - you may want to add an
options argument to **.fetch** that can help you control things in finer
detail, though you'd have to leave a provision for saving private keys
like id or anything else that probably should not change midway by the
server.

It can be difficult to spec out a ``.save()`` method but we are going to
give it a go. Basically, we want to be able to save the model as is, or
pass on a key/value pair or an object to the save method, set it on the
model and then save. An alternative spec would be to be able to just
save to server without saving to the model first if arguments are passed
- but we can already do this by calling
``model.update({some: 'data'});``

javascript

::

    save: function(key, value) {
        // saves model or accepts a key/value pair/object, sets to model and then saves.
        var method = ['update','create'][+this.isNew()];

        if (key) {
            // if key is an object, go to overloadSetter.
            var ktype = typeOf(key),
                canSet = ktype == 'object' || (ktype == 'string' && typeof value != 'undefined');

            canSet && this._set.apply(this, arguments);
        }

        // we want to set this.
        this._throwAwaySyncEvent('sync:' + this.getRequestId(), function() {
            this.fireEvent('save');
            this.fireEvent(method);
        });


        // create first time we sync, update after.
        this[method]();
        this.isNewModel = false;

        return this;
    }

And the helper method that just returns how new we think the model is:
 javascript

::

    isNew: function() {
        if (typeof this.isNewModel === 'undefined')
            this.isNewModel = true;

        return this.isNewModel;
    }

We can now use this in 1 of 3 ways.
 javascript

::

    modelInstance.save(); // save the current model, will fire 'create', then 'update'
    modelInstance.save('hello', 'there'); // sets `hello: there` into the model, then saves
    modelInstance.save({
        'hello': 'again',
        'foo': 'bar'
    }); // saves hello: again, foo: bar into the model, then saves

    modelInstance.get('hello'); // again
    // as opposed to a simple object literal passed through:
    modelInstance.update({'hi': 'there'});
    // this kind update is partial - it won't export the rest of the model. .update() does.
    modelInstance.get('hi'); // null

So, what does the fabled sync method look like in the end?
 javascript

::

    sync: function(method, model, options) {
        // internal low level api that works with the model request instance.
        options = options || {};
        
        // determine what to call or do a read by default.
        method = method && Model.methodMap[method] 
            ? Model.methodMap[method] 
            : Model.methodMap['read'];
        
        options.method = method;

        // if it's a method via POST, append passed object or use exported model
        if (method == Model.methodMap.create || method == Model.methodMap.update)
            options.data = model || this.toJSON();

        // make sure we have the right URL
        options.url = this.get('urlRoot') + this.get('id') + '/';

        // pass it all to the request
        this.request.setOptions(options);
        
        // call the request class' corresponding method (mootools does that for free!)
        this.request[method](model);
    }

Nothing too fancy is required. We want to determine what the method is
first, based upon our map. We care if its a method that POSTs data and
if so, we export the serialised model or the passed model argument. This
allows you to be more flexible and be able to update parts of the model
on the fly, eg. ``Model.update({name:'dimitar'})`` - even if that name
differs from the one in your model, it will just dispatch it to the
server.

We also compose a URL and try to append a model id to it.

That's about all you need to get going, really. How would you use it?

javascript

::

    // define a new prototype for our model. 
    // You can just make an instance of Model.sync directly but this is cleaner
    var userModel = new Class({

        Extends: Epitome.Model.Sync,

        options: {
            defaults: {
                urlRoot: '/account/'
            }
        }
    });

    var user = new userModel({
        id: '25'
    }, {
        onChange: function() {
            some.viewRenderer(this.toJSON);
        },
        onSync: function() {
            console.log('hi');
        }
    });

    // read the data periodically
    user.fetch.periodical(3000, user);

And thus, we have the ability to keep our models in sync with the server
- or at the very least, have a way of talking to some endpoints and hope
for the best. The pattern and API is not perfect but it allows you to
have a different medium for syncing, like storage - all you really want
is to keep the main method names and arguments sane and interchangeable.

What does it all look like in the end? Well, you can look at the `source
code`_ or play with it on `this jsfiddle`_. We use jsfiddle and not
QMetric's own Chiel's `tinker.io`_ as we need a request echo service. In
order for it to work, we set the model urlRoot to ``/echo/`` and the
model id to ``json``, which combines to return ``/echo/json/`` and
comply with the format that jsfiddle requires.

Feel free to fork it, play with it, extend it or whatever. Any issues or
questions, either post as a comment here, open an issue on github or
catch me on IRC - irc://irc.freenode.net#mootools, nick coda. Next
installments: Syncing to local and sessionStorage and then we do a quick
'how to build your first controller'.

.. _MooTools: http://mootools.net
.. _`Part 1: Creating your own MVC-like data model class in MooTools`: /creating-your-own-mvc-like-data-model-class-in-mootools_59.html
.. _Epitome: https://github.com/DimitarChristoff/Epitome
.. _here: http://dimitarchristoff.github.com/Epitome/epitome-model-sync.html
.. _`https://tinker.io/beceb`: https://tinker.io/beceb
.. _github: https://github.com/DimitarChristoff/Epitome/blob/master/src/epitome-model.js
.. _By creating our buster tests: https://github.com/DimitarChristoff/Epitome/blob/master/test/tests/epitome-model-sync-test.js#L4
.. _exports all that is good: https://github.com/mootools/mootools-core/blob/master/Source/Request/Request.js#L234-245
.. _source code: https://github.com/DimitarChristoff/Epitome/blob/master/src/epitome-model-sync.js
.. _this jsfiddle: http://jsfiddle.net/dimitar/ATN3y/
.. _tinker.io: http://tinker.io/
