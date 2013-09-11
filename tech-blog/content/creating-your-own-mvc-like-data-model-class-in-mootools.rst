Creating your own MVC-like data model class in MooTools
#######################################################
:date: 2012-04-10 17:07
:author: tech_ape
:category: javascript, mootools
:tags: Epitome, mootools, MVC, tutorial
:slug: creating-your-own-mvc-like-data-model-class-in-mootools

.. raw:: html

   <div class="alert">

**This is a `MooTools`_ JavaScript library tutorial**
 Difficulty: moderate
 Skill: intermediate+
 Requires: Prior knowledge of javascript, MooTools and MooTools Classes

.. raw:: html

   </div>

.. raw:: html

   <div class="alert alert-info">

**UPDATE:**\ This tutorial is now hosted in its own GitHub repository
called `Epitome`_. You can view the Groc documentation of the class on
the gh-pages branch `here`_.

.. raw:: html

   </div>

The boom in client-side MVC libraries like Backbone.js, Ember (Sprout),
Knockout.js and so forth has been nothing short of amazing. It provides
a great pattern of data-driven rendering and events without having any
extra logic to cater for display.

I guess it makes sense for users of libraries such as jQuery (or Zepto)
to rely on a 3-rd party MVC (or `MVVM`_) framework but if you're a
MooTools user, the return is somewhat diminished. The nature of
event-based programming in MooTools via the DOMEvent and Class.Event
APIs has always granted extra flexibility and is in no small part
instrumental in our decision to use MooTools in the first place.

Having said that, the idea of a Class (or Object) that reacts to data
model changes is not without an appeal. Let's just create some basic
specs for a Data Model in a possible MVC pattern:

-  custom setter that changes any property on the data model
-  custom getter that can return a property from the data model
-  access to the data model directly w/o the API
-  ability to set/get multiple properties at the same time
-  ability to fire a single change event for when all properties have
   been updated
-  ability to fire a change:propertyname event for every property change
   but not set
-  ability to export the whole data model

These are also nice to have features that most frameworks will support
but they are not essential to a core Model experiment:

-  serialisation of Models (IDs)
-  ability to distinguish between non-primitive values like objects that
   look the same but are not the same object: should NOT raise a change
   event
-  sync func: ability to load, save and delete the data model RESTfully
   (ish).

Best way to keep track of what we are tying to achieve is to write the
specs into a Test Case. We are going to use Buster.js and here is what
we have come up with for the Model: `tests/epitome-model-test.js`_. As
we go along, we will slow start making these tests pass. You can
checkout some of the branches in the repository to see how it shapes up
at each stage:

``git checkout [branchname]``, where branchname is one of the following
(in this order): *skeleton*, *attributes*, *overload*, *events*,
*accessors*, *is-equal* and finally, back to *master*. Of course, you
can just do git fetch;git br -lr; and see what's cooking...

So, without further ado, let's get started with the core of the Class,
i.e.: the closure and storage for the data object:

javascript

::

    !function() {
        
        var Model = this.Model = new Class({

            Implements: [Options, Events],

            _attributes: {}, // initial `private` object

            options: {
                defaults: {
                }
            },

            initialize: function(obj, options) {
                // constructor for Model class.

                // are there any defaults passed? better to have them on the proto.
                options && options.defaults && (this.options.defaults = Object.merge(this.options.defaults, options.defaults));

                // initial obj should pass on a setter (this will fail for now).
                obj && typeOf(obj) === 'object' && this.set(Object.merge(this.options.defaults, obj));

                // merge options overload
                this.setOptions(options);
            }
        }) // end class
    }()

So far, so good. We have our skeleton. We have spec'd out the need to
have a simple ``set`` method. In order to implement the set, we need to
think about where to place the actual data model. It can be a truly
private object inside the closure, but this means it cannot be re-used
(occluded) between different model instances. So we are going to make it
a property on the class. This is more-or-less standard practice,
although it does mean external interference can directly modify model
values without firing events. With that in mind... we will have our data
model in the ``this._attributes`` *object*.

.. raw:: html

   <div class="alert alert-warning">

There is nothing to prevent access to the attributes object by means of
referencing ``instance._attributes.property``.

.. raw:: html

   </div>

Despite of the lack of privacy for our data model, we are going to
create a function as the basic setter API method, a simple **key =>
value** dispatcher with some naive logic:

javascript

::

    set: function(key, value) {
        // needs to be bound the the instance.
        if (!key || typeof value === undefined)
            return this;

        // no change? this is crude and works for primitives.
        if (this._attributes[key] && this._attributes[key] === value)
            return this;

        if (value === null) {
            delete this._attributes[key]; // delete = null.
        }
        else {
            this._attributes[key] = value;
        }

        // fire an event.
        this.fireEvent('change:' + key, value);

        // store changed keys...
        this.propertiesChanged.push(key);

        return this;
    }

This is fine - it will deal with being able to set a single property. We
can now add a test of our class already - which you can see on this
`tinker.io`_ (modified so it runs with what we have so far).

But, we also need to look at our specs. The above will work for a single
property change but if we need to call each property manually, it
becomes rather inconvenient. Instead, we will refactor a little and
create a new dummy set function, moving the function above into \_set
and decorating it with ``.overloadSetter`` - which is a MooTools API
that allows overloading a single key -> value pair to a full object. It
now starts to look like this:

javascript

::

    set: function() {
        // call the real getter. we proxy this because we want
        // a single event after all properties are updated and the ability to work with
        // either a single key, value pair or an object
        this.propertiesChanged = [];
        this._set.apply(this, arguments);
        this.propertiesChanged.length && this.fireEvent('change', [this.propertiesChanged]);
    },

    // private, real setter functions, not on prototype, see note above
    _set: function(key, value) {
        // needs to be bound the the instance.
        if (!key || typeof value === undefined)
            return this;

        // custom setter - see bit further down
        if (this.properties[key] && this.properties[key]['set']) {
            return this.properties[key]['set'].call(this, value);
        }
        
        // no change? this is crude and works for primitives.
        if (this._attributes[key] && this._attributes[key] === value)
            return this;

        if (value === null) {
            delete this._attributes[key]; // delete = null.
        }
        else {
            this._attributes[key] = value;
        }

        // fire an event.
        this.fireEvent('change:' + key, value);

        // store changed keys...
        this.propertiesChanged.push(key);

        return this;
    }.overloadSetter(), // mootools abstracts overloading to allow object iteration

What we have written so far deals with a lot of our specs, namely:
private setter, event per every property, event after all properties and
even a change event only fires when a change takes place, not on every
set. We have an event API that works and we also have a
``propertiesChanged`` array, which lets us pass on all actually changed
properties to the unified event handler. We also have created a pseudo
delete func by passing null as property value. So far, so good. We have
also allowed for custom setters - a bit more on that later.

Now, we should provide access to the data via an API - let's create our
first getter:

javascript

::

    get: function(key) {
        // overload getter, 2 paths...

        // custom accessors take precedence and have no reliance on item being in attributes
        if (key && this.properties[key] && this.properties[key]['get']) {
            return this.properties[key]['get'].call(this);
        }

        // else, return from attributes or return null when undefined.
        return (key && typeof this._attributes[key] !== 'undefined') 
            ? this._attributes[key] 
            : null;
    }.overloadGetter()

Just like before, we pass it through the MooTools ``.overloadGetter``
API, which is the counterpart of overloadSetter.

This allows us to get multiple properties, eg,
``model.get(['id', 'name', 'surname'])`` will return a single object
with only these properties (if available).

One thing that MooTools tends to support is the ability to define custom
\`accessors\` (getters and setters) that override your defaults. So...
we are going to have to revisit what we wrote as this can provide a very
nice tool that safeguards against direct use of certain properties. Eg,
you may want to internally parse a ``model.set("date", "20-12-77")`` to
a more meaningful value - or when you have ``model.get("dateObject")``,
you may want that to be an actual Date object.

This is a MooToolish practice, similar in API to the custom element
accessors - eg, the accessors for ``Element.get("tween")`` and
``Element.set("tween")`` look like this:
`https://github.com/mootools/mootools-core/blob/master/Source/Fx/Fx.Tween.js#L45-61`_.
We do the same thing in our Model:

javascript

::

    // we add this object of overrides to our model class first.
    properties: {},

    // now, change the getter and add support for that
    get: function(key) {
        // and the overload getter
        return (key && typeof this._attributes[key] !== undefined)
            ? this.properties[key] && this.properties[key]['get'] ? this.properties[key]['get'].call(this) : this._attributes[key]
            : null;
    }.overloadGetter()

What we do here is we call any functions bound in the
model.properties.property object and let them deal with how the data is
set or retrieved. You can define either a get or a set override or both.
In reality, it could look like this when you want to modify an existing
Model:

javascript

::

    var foo = new Model({
        date: "2001-11-30"
    });

    foo.properties.date.get = function() {
        return Date(this._attributes['date']));
    };

    foo.get("date"); // -> Date object, not string. 

However, the above practice is not very semantic, you are changing the
behavior of a Model instance and not your Model prototype. In reality,
you want to abstract your custom Models by extending your base Model
class.

In any case, things are starting to shape up. Here is what our Model
Class is starting to look like: `https://tinker.io/e2f30`_.

We are now going to create a custom version of a Model that can deal
with Users with a special accessor for for say, ``fullName``:

javascript

::

    // create a new user model by extending Model
    var User = new Class({
        
        Extends: Model,

        // define a custom accessor
        properties: {
            fullName: {
                get: function() {
                    return Object.values(this.get(["name", "surname"])).join(" ");
                },
                set: function(value) {
                    var parts = value.split(" ");
                    // notice we call _set directly or the change event won't fire correctly
                    this._set({
                        "name": parts[0],
                        "surname": parts[1]
                    });
                }
            }
        }
    });
                    
    // instantiate the new User Model                
    var myUser = new User({
        name: "Bob",
        surname: "Robertson"
    });   
                    
    console.log(myUser.get("fullName")); // Bob Robertson      
    myUser.set("fullName", "Bob Awesome");
    console.log(myUser.get("surname")); // awesome        

This way, the actual data Model in ``_attributes`` will never have the
value ``fullName`` but it will work just as if it does. See the magic
happen on this `updated tinker`_

Our core Model is nearly complete. There is a pseudo 'standard' in MVC
frameworks out there to add a ``toJSON`` method that returns the current
data model. Please note that despite of what the name suggests,
**toJSON** returns an *object* and not a JSON string. This may seem a
redundant gesture as the instance has direct access to the
``._attributes`` object that contains all our data. However, by
providing an API you can extend it later and filter what actually gets
exported. Last but not least, ``._attributes`` is an *Object* and we
need to dereference it from the Model when we export it, otherwise
changes by reference can affect our Model data without our knowledge.

javascript

::

    toJSON: function() {
        return Object.clone(this._attributes);
    }

View the complete Model class here: `https://tinker.io/beceb`_

It is important to know that the Model won't fire a change event for
every set. Eg.:

javascript

::

    myUser.set("dateOfBirth", "31/07/1975"); // fires change:dateOfBirth and change: fn(['dateOfBirth'])
    myUser.set("dateOfBirth", "31/07/1975"); // does NOT fire anything.

    // because we just do a simple compare and comparing 2 objects of the same structure returns false, this will fire always:
    myUser.set("dateOfBirth", new Date(1975, 6, 31)); // fires change:dateOfBirth and change: fn(['dateOfBirth'])
    myUser.set("dateOfBirth", new Date(1975, 6, 31)); // fires change:dateOfBirth again even though they are the same.

We will look at fixing the change events so they don't fire for similar
looking object types in our next installment.

This concludes part 1 of the Model tutorial. In part 2, we will try to
make it more versatile and have a go at sync funcs. Part 3 will cover
how to create a collection of Models and part 4 will deal with the View
(rendering).

.. _MooTools: http://mootools.net
.. _Epitome: https://github.com/DimitarChristoff/Epitome
.. _here: http://dimitarchristoff.github.com/Epitome/src/epitome-model.html
.. _MVVM: http://en.wikipedia.org/wiki/Model_View_ViewModel
.. _tests/epitome-model-test.js: https://github.com/DimitarChristoff/Epitome/blob/master/test/tests/epitome-model-test.js#L3
.. _tinker.io: https://tinker.io/4915e
.. _`https://github.com/mootools/mootools-core/blob/master/Source/Fx/Fx.Tween.js#L45-61`: https://github.com/mootools/mootools-core/blob/master/Source/Fx/Fx.Tween.js#L45-61
.. _`https://tinker.io/e2f30`: https://tinker.io/e2f30
.. _updated tinker: https://tinker.io/beceb/4/
.. _`https://tinker.io/beceb`: https://tinker.io/beceb
