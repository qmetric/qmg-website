webkit DOM performance update
#############################
:date: 2012-04-12 09:43
:author: tech_ape
:category: html, javascript
:tags: dom, webkit
:slug: webkit-dom-performance-update

Just in today, Chromium dev team announced a huge improvement to webkit,
including some 240% boost to ``innerHTML`` performance and much more.

    DOM performance boosts summary

-  ``div.innerHTML`` and ``div.outerHTML`` **performance improved by 2.4x** (V8, JSC)
-  ``div.innerText`` and ``div.outerText`` performance in Chromium/Mac **by 4x** (V8/Mac)
-  CSS property accesses improved **by 35%** (JSC)
-  ``div.classList``, ``div.dataset`` and ``div.attributes`` perf improved by **up to 10.9x** (V8)
-  ``div.firstElementChild``, ``lastElementChild``, ``previousElementSibling`` and ``nextElementSibling`` perf improved **by 7.1x** (V8)
-  ``div.childNodes`` perf improved **by 15%** (V8, JSC)
-  V8 DOM attributes access improved **by 4 ~ 5%** (V8)
