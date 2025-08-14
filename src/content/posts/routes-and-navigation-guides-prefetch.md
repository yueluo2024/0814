---
author: AA
category:
- One
cover: https://images.unsplash.com/photo-1414438992182-69e404046f80?ixid=M3w2NzEyNTB8MHwxfHNlYXJjaHw0fHxidWlsZGluZyUyMGNvbW1pY3xlbnwwfDB8MXx8MTczMDU1Mjc1N3ww&ixlib=rb-4.0.3&w=1960&h=1102&auto=format&fit=crop&q=60
coverAlt: Leaning Tower of Pisa, Italy
description: Prefetch links for snappier navigation between pages.
pubDate: 2024-01-15 00:00:00
slug: routes-and-navigation-guides-prefetch
tags:
- astro-build
- PHP
- Less
title: Prefetch 
---

Page load times play a big role in the usability and overall enjoyment of a site. Astro’s **opt\-in prefetching** brings the benefits of near\-instant page navigations to your multi\-page application (MPA) as your visitors interact with the site.


Enable prefetching
------------------

[Section titled Enable prefetching](#enable-prefetching)
You can enable prefetching with the `prefetch` config:




astro.config.mjs


```
import { defineConfig } from 'astro/config';
export default defineConfig({  prefetch: true});
```

A prefetch script will be added to all pages of your site. You can then add the `data-astro-prefetch` attribute to any `<a />` links on your site to opt\-in to prefetching. When you hover over the link, the script will fetch the page in the background.







```
<a href="/about" data-astro-prefetch>
```

Note that prefetching only works for links within your site, and not external links.


Prefetch configuration
----------------------

[Section titled Prefetch configuration](#prefetch-configuration)
The `prefetch` config also accepts an option object to further customize prefetching.


### Prefetch strategies

[Section titled Prefetch strategies](#prefetch-strategies)
Astro supports 4 prefetch strategies for various use cases:


* `hover` (default): Prefetch when you hover over or focus on the link.
* `tap`: Prefetch just before you click on the link.
* `viewport`: Prefetch as the links enter the viewport.
* `load`: Prefetch all links on the page after the page is loaded.


You can specify a strategy for an individual link by passing it to the `data-astro-prefetch` attribute:







```
<a href="/about" data-astro-prefetch="tap">About</a>
```

Each strategy is fine\-tuned to only prefetch when needed and save your users’ bandwidth. For example:


* If a visitor is using [data saver mode](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData) or has a [slow connection](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType), prefetch will fallback to the `tap` strategy.
* Quickly hovering or scrolling over links will not prefetch them.


### Default prefetch strategy

[Section titled Default prefetch strategy](#default-prefetch-strategy)
The default prefetch strategy when adding the `data-astro-prefetch` attribute is `hover`. To change it, you can configure [`prefetch.defaultStrategy`](/en/reference/configuration-reference/#prefetchdefaultstrategy) in your `astro.config.mjs` file:




astro.config.mjs


```
import { defineConfig } from 'astro/config';
export default defineConfig({  prefetch: {    defaultStrategy: 'viewport'  }});
```

### Prefetch all links by default

[Section titled Prefetch all links by default](#prefetch-all-links-by-default)
If you want to prefetch all links, including those without the `data-astro-prefetch` attribute, you can set [`prefetch.prefetchAll`](/en/reference/configuration-reference/#prefetchprefetchall) to `true`:




astro.config.mjs


```
import { defineConfig } from 'astro/config';
export default defineConfig({  prefetch: {    prefetchAll: true  }});
```

You can then opt\-out of prefetching for individual links by setting `data-astro-prefetch="false"`:







```
<a href="/about" data-astro-prefetch="false">About</a>
```

The default prefetch strategy for all links can be changed with `prefetch.defaultStrategy` as shown in the [Default prefetch strategy section](#default-prefetch-strategy).


Prefetch programmatically
-------------------------

[Section titled Prefetch programmatically](#prefetch-programmatically)
As some navigation might not always appear as `<a />` links, you can also prefetch programmatically with the `prefetch()` API from the `astro:prefetch` module:







```
<button id="btn">Click me</button>
<script>  import { prefetch } from 'astro:prefetch';
  const btn = document.getElementById('btn');  btn.addEventListener('click', () => {    prefetch('/about');  });</script>
```

The `prefetch()` API includes the same [data saver mode](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData) and [slow connection](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType) detection so that it only prefetches when needed.


To ignore slow connection detection, you can use the `ignoreSlowConnection` option:







```
// Prefetch even on data saver mode or slow connectionprefetch('/about', { ignoreSlowConnection: true });
```

Make sure to only import `prefetch()` in client\-side scripts as it relies on browser APIs.


Using with View Transitions
---------------------------

[Section titled Using with View Transitions](#using-with-view-transitions)
When you use [View Transitions](/en/guides/view-transitions/) on a page, prefetching will also be enabled by default. It sets a default configuration of `{ prefetchAll: true }` which enables [prefetching for all links](#prefetch-all-links-by-default) on the page.


You can customize the prefetch configuration in `astro.config.mjs` to override the default. For example:




astro.config.mjs


```
import { defineConfig } from 'astro/config';
export default defineConfig({  // Disable prefetch completely  prefetch: false});
```



astro.config.mjs


```
import { defineConfig } from 'astro/config';
export default defineConfig({  // Keep prefetch, but only prefetch for links with `data-astro-prefetch`  prefetch: {    prefetchAll: false  }});
```

Browser support
---------------

[Section titled Browser support](#browser-support)
Astro’s prefetching uses [`<link rel="prefetch">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/prefetch) if supported by the browser, and falls back to the [`fetch()` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) otherwise.


The most common browsers support Astro’s prefetching with subtle differences:


### Chrome

[Section titled Chrome](#chrome)
Chrome supports `<link rel="prefetch">`. Prefetching works as intended.


### Firefox

[Section titled Firefox](#firefox)
Firefox supports `<link rel="prefetch">` but may display errors or fail entirely:


* Without an explicit cache header (e.g. [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) or [`Expires`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires)), prefetching will error with `NS_BINDING_ABORTED`.
* Even in the event of an error, if the response has a proper [`ETag`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) header, it will be re\-used on navigation.
* Otherwise, if it errors with no other cache headers, the prefetch will not work.


### Safari

[Section titled Safari](#safari)
Safari does not support `<link rel="prefetch">` and will fall back to the `fetch()` API which requires cache headers (e.g. [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control), [`Expires`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires), and [`ETag`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)) to be set. Otherwise, the prefetch will not work.


**Edge case:** `ETag` headers do not work in private windows.


### Recommendations

[Section titled Recommendations](#recommendations)
To best support all browsers, make sure your pages have the proper cache headers.


For static or prerendered pages, the `ETag` header is often automatically set by the deployment platform and is expected to work out of the box.


For dynamic and server\-side rendered pages, set the appropriate cache headers yourself based on the page content. Visit the [MDN documentation on HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) for more information.


Migrating from `@astrojs/prefetch`
----------------------------------

[Section titled Migrating from @astrojs/prefetch](#migrating-from-astrojsprefetch)
The `@astrojs/prefetch` integration was deprecated in v3\.5\.0 and will eventually be removed entirely. Use the following instructions to migrate to Astro’s built\-in prefetching which replaces this integration.


1. Remove the `@astrojs/prefetch` integration and enable the `prefetch` config in `astro.config.mjs`:




astro.config.mjs


```
import { defineConfig } from 'astro/config';import prefetch from '@astrojs/prefetch';
export default defineConfig({  integrations: [prefetch()],  prefetch: true});
```
2. Convert from `@astrojs/prefetch`’s configuration options:


	* The deprecated integration used the `selector` config option to specify which links should be prefetched upon entering the viewport.
	
	
	Add `data-astro-prefetch="viewport"` to these individual links instead.
	
	
	
	
	
	
	
	```
	<a href="/about" data-astro-prefetch="viewport">
	```
	* The deprecated integration used the `intentSelector` config option to specify which links should be prefetched when they were hovered over or focused.
	
	
	Add `data-astro-prefetch` or `data-astro-prefetch="hover"` to these individual links instead:
	
	
	
	
	
	
	
	```
	<!-- You can omit the value if `defaultStrategy` is set to `hover` (default) --><a href="/about" data-astro-prefetch>
	<!-- Otherwise, you can explicitly define the prefetch strategy --><a href="/about" data-astro-prefetch="hover">
	```
	* The `throttles` option from `@astrojs/prefetch` is no longer needed as the new prefetch feature will automatically schedule and prefetch optimally.


Learn