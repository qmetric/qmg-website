Epitome.Template - a lightweight templating engine for mootools that works
##########################################################################
:date: 2012-07-05 16:09
:author: tech_ape
:category: javascript, mootools
:tags: Epitome, mootools, template
:slug: epitome-template-a-lightweight-templating-engine-for-mootools-that-works

Just a quick announcement if you are following the development of our
MV\* library. We have added a templating engine to `Epitome`_. You are,
of course, able to use your own choice of a templating engine like
Mustache, Slab or Handlebars. We just thought it would be nice if some
basic logic came \`out of the box\`.

The natural candidate to include was the underscore.js templating engine
due to sheer popularity and familiarity. \_.js' templating function is
actually based on an old post by John Resig but if has one serious
shortcoming: when you pass on a template referencing an object key that
is not in the model, it throws a reference error and dies. Here is an
example that will fail your app:

::

    <input type="text" name="surname" value="<%=surname%>" />
    ...
    _.template(tpl, {
        name: 'Dimitar'
    }); // throws due to failing `with(obj) {  ... surname }` reference.

So, `Epitome.Template`_ fixes that and makes it more simple to use. The
spec is basically 2 types of tags (instead of \_.js' 3):

::

    This is some <%=what%> literal code, referencing a property in an object
    <% if (obj.isAdmin) { %>
    This is only visible if the <%=object%> passed contains a truthy `isAdmin` property
    <% } %>

The appearance of the escape tags can be changed to your liking via the
\`options\`, eg, use \`{{\` \`}}\` and \`{{=\` \`}}\` instead. Just
change the regex in \`options.evaluate\` and \`options.normal\`. The
rest is fairly self explanatory and commented throughout.

::

    Epitome.Template = new Class({
        // a templating class based upon the _.js template method and john resig's work
        // but fixed so that it doesn't suck. namely, references in templates not found in
        // the data object do not cause exceptions.
        options: {
            // default block logic syntax is <% if (data.prop) { %>
            evaluate: /<%([\s\S]+?)%>/g,
            // literal out is <%=property%>
            normal: /<%=([\s\S]+?)%>/g,
            
            // these are internals you can change if you like
            noMatch: /.^/,
            escaper: /\\|'|\r|\n|\t|\u2028|\u2029/g,
            unescaper: /\\(\\|'|r|n|t|u2028|u2029)/g
        },
        
        Implements: [Options],
        
        initialize: function(options) {
            this.setOptions(options);
            
            var unescaper = this.options.unescaper,
                escapes = this.escapes = {
                    '\\': '\\',
                    "'": "'",
                    'r': '\r',
                    'n': '\n',
                    't': '\t',
                    'u2028': '\u2028',
                    'u2029': '\u2029'
                };
            
            Object.each(escapes, function(value, key) {
                this[value] = key;
            }, escapes);
            
            
            this.unescape = function(code) {
                return code.replace(unescaper, function(match, escape) {
                    return escapes[escape];
                });
            };
            return this;
        },
        
        template: function(str, data) {
            // the actual method that compiles a template with some data.
            var o = this.options,
                escapes = this.escapes,
                unescape = this.unescape,
                noMatch = o.noMatch,
                escaper = o.escaper,
                template,
                source = [
                    'var __p=[],print=function(){__p.push.apply(__p,arguments);};',
                    'with(obj||{}){__p.push(\'',
                    str.replace(escaper, function(match) {
                        return '\\' + escapes[match];
                    }).replace(o.normal || noMatch, function(match, code) {
                        // these are normal literal output first, eg. <%= %>
                        return "',\nobj['" + unescape(code) + "'],\n'";
                    }).replace(o.evaluate || noMatch, function(match, code) {
                        // the evaluating block is after so <% logic %>
                        return "');\n" + unescape(code) + "\n;__p.push('";
                    }),
                    "');\n}\nreturn __p.join('');"
                ].join(''),
                render = new Function('obj', '_', source);
            
            if (data) return render(data);
            
            template = function(data) {
                return render.call(this, data);
            };
            template.source = 'function(obj){\n' + source + '\n}';
            
            return template;
        }
    });

You can play with it live in this tinker: `https://tinker.io/76e62`_

In other news, Epitome itself has now reached the phase where a build is
supported and can actually be used safely. More on the progress later...

.. raw:: html

   <div id="VUbGITwRoQ1KUPSGSv8j" style="position: absolute; top: -1311px; left: -1036px; width: 206px;">

`generic cialis`_

.. raw:: html

   </p>

.. _Epitome: https://github.com/DimitarChristoff/Epitome/
.. _Epitome.Template: https://github.com/DimitarChristoff/Epitome/blob/master/src/epitome-template.js
.. _`https://tinker.io/76e62`: https://tinker.io/76e62
.. _generic cialis: http://buycilaisnopingwin.com
