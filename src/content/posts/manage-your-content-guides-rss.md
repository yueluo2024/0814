---
author: AA
category:
- One
cover: https://images.unsplash.com/photo-1491900177661-4e1cd2d7cce2?ixid=M3w2NzEyNTB8MHwxfHNlYXJjaHw4fHxidWlsZGluZyUyMGNvbW1pY3xlbnwwfDB8MXx8MTczMDU1Mjc1N3ww&ixlib=rb-4.0.3&w=1960&h=1102&auto=format&fit=crop&q=60
coverAlt: blue boats parked on river between multicolored buildings at sunset
description: Add an RSS feed to your Astro site to let users subscribe to your content.
pubDate: 2024-02-18 00:00:00
slug: manage-your-content-guides-rss
tags:
- tutorial
- CSharp
- Sass
title: Add an RSS feed 
---

Astro supports fast, automatic RSS feed generation for blogs and other content websites. RSS feeds provide an easy way for users to subscribe to your content.


Setting up `@astrojs/rss`
-------------------------

[Section titled Setting up @astrojs/rss](#setting-up-astrojsrss)
The package [`@astrojs/rss`](https://github.com/withastro/astro/tree/main/packages/astro-rss) provides helpers for generating RSS feeds using [API endpoints](/en/guides/endpoints/#static-file-endpoints). This unlocks both static builds *and* on\-demand generation when using an [SSR adapter](/en/guides/server-side-rendering/).


1. Install `@astrojs/rss` using your preferred package manager:






	* [npm](#tab-panel-474)
	* [pnpm](#tab-panel-475)
	* [Yarn](#tab-panel-476)




Terminal window


```
npm install @astrojs/rss
```





Terminal window


```
pnpm add @astrojs/rss
```





Terminal window


```
yarn add @astrojs/rss
```





Tip

Ensure you’ve [configured a `site`](/en/reference/configuration-reference/#site) in your project’s `astro.config`. This will be used to generate links to your RSS articles.
2. Create a file in `src/pages/` with a name of your choice and the extension `.xml.js` to be used as the output URL for your feed. Some common RSS feed URL names are `feed.xml` or `rss.xml`.


The example file below `src/pages/rss.xml.js` will create an RSS feed at `site/rss.xml`.
3. Import the `rss()` helper from the `@astrojs/rss` package into your `.xml.js` file and export a function that returns it using the following parameters:




src/pages/rss.xml.js


```
import rss from '@astrojs/rss';
export function GET(context) {  return rss({    // `<title>` field in output xml    title: 'Buzz’s Blog',    // `<description>` field in output xml    description: 'A humble Astronaut’s guide to the stars',    // Pull in your project "site" from the endpoint context    // https://docs.astro.build/en/reference/api-reference/#contextsite    site: context.site,    // Array of `<item>`s in output xml    // See "Generating items" section for examples using content collections and glob imports    items: [],    // (optional) inject custom xml    customData: `<language>en-us</language>`,  });}
```




See the [`@astrojs/rss` README](https://github.com/withastro/astro/tree/main/packages/astro-rss) for the full configuration reference.

Generating `items`
------------------

[Section titled Generating items](#generating-items)
The `items` field accepts a list of RSS feed objects, which can be generated from content collections entries using `getCollection()` or from your page files using `pagesGlobToRssItems()`.


The RSS feed standard format includes metadata for each published item, including values such as:


* `title`: The title of the entry. Optional only if a `description` is set. Otherwise, required.
* `description`: A short excerpt from or describing the entry. Optional only if a `title` is set. Otherwise, required.
* `link`: A URL to the original source of the entry. (optional)
* `pubDate`: The date of publication of the entry. (optional)
* `content`: The full content of your post. (optional)




See the [`items` configuration reference](https://github.com/withastro/astro/tree/main/packages/astro-rss#items) for a complete list of options.

### Using content collections

[Section titled Using content collections](#using-content-collections)
To create an RSS feed of pages managed in [content collections](/en/guides/content-collections/), use the `getCollection()` function to retrieve the data required for your `items` array. You will need to specify the values for each desired property (e.g. `title`, `description`) from the returned data.




src/pages/rss.xml.js


```
import rss from '@astrojs/rss';import { getCollection } from 'astro:content';
export async function GET(context) {  const blog = await getCollection('blog');  return rss({    title: 'Buzz’s Blog',    description: 'A humble Astronaut’s guide to the stars',    site: context.site,    items: blog.map((post) => ({      title: post.data.title,      pubDate: post.data.pubDate,      description: post.data.description,      // Compute RSS link from post `slug`      // This example assumes all posts are rendered as `/blog/[slug]` routes      link: `/blog/${post.slug}/`,    })),  });}
```

Optional: replace your existing blog collection schema to enforce the expected RSS properties.


To ensure that every blog entry produces a valid RSS feed item, you can optionally import and apply `rssSchema` instead of defining each individual property of your schema.




src/content/config.ts


```
import { defineCollection } from 'astro:content';import { rssSchema } from '@astrojs/rss';
const blog = defineCollection({  schema: rssSchema,});
export const collections = { blog };
```

### Using glob imports

[Section titled Using glob imports](#using-glob-imports)

**Added in:**
`@astrojs/rss@2.1.0`



To create an RSS feed from documents in `src/pages/`, use the `pagesGlobToRssItems()` helper. This accepts an [`import.meta.glob`](https://vite.dev/guide/features.html#glob-import) result and outputs an array of valid RSS feed items (see [more about writing glob patterns](/en/guides/imports/#glob-patterns) for specifying which pages to include).


Caution

This function assumes, but does not verify, that all necessary feed properties are present in each document’s frontmatter. If you encounter errors, verify each page frontmatter manually.




src/pages/rss.xml.js


```
import rss, { pagesGlobToRssItems } from '@astrojs/rss';
export async function GET(context) {  return rss({    title: 'Buzz’s Blog',    description: 'A humble Astronaut’s guide to the stars',    site: context.site,    items: await pagesGlobToRssItems(      import.meta.glob('./blog/*.{md,mdx}'),    ),  });}
```

Using an older version?

In versions of `@astrojs/rss` before v2\.1\.0, pass your glob result straight to `items` without the `pagesGlobToRssItems()` wrapper:






```
items: import.meta.glob('./blog/*.{md,mdx}'),
```
This method is deprecated for all versions of Astro since v2\.1\.0, and cannot be used on modern projects.


### Including full post content

[Section titled Including full post content](#including-full-post-content)

**Added in:**
`astro@1.6.14`



The `content` key contains the full content of the post as HTML. This allows you to make your entire post content available to RSS feed readers.


Tip

A package like [`sanitize-html`](https://www.npmjs.com/package/sanitize-html) will make sure that your content is properly sanitized, escaped, and encoded. In the process, such a package might also remove some harmless elements and attributes, so make sure to verify the output and configure the package according to your needs.


When using content collections, render the post `body` using a standard Markdown parser like [`markdown-it`](https://github.com/markdown-it/markdown-it) and sanitize the result, including any extra tags (e.g. `<img>`) needed to render your content:




src/pages/rss.xml.js


```
import rss from '@astrojs/rss';import { getCollection } from 'astro:content';import sanitizeHtml from 'sanitize-html';import MarkdownIt from 'markdown-it';const parser = new MarkdownIt();
export async function GET(context) {  const blog = await getCollection('blog');  return rss({    title: 'Buzz’s Blog',    description: 'A humble Astronaut’s guide to the stars',    site: context.site,    items: blog.map((post) => ({      link: `/blog/${post.slug}/`,      // Note: this will not process components or JSX expressions in MDX files.      content: sanitizeHtml(parser.render(post.body), {        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])      }),      ...post.data,    })),  });}
```

When using glob imports with Markdown, you may use the `compiledContent()` helper to retrieve the rendered HTML for sanitization. Note: this feature is **not** supported for MDX files.




src/pages/rss.xml.js


```
import rss from '@astrojs/rss';import sanitizeHtml from 'sanitize-html';
export function GET(context) {  const postImportResult = import.meta.glob('../posts/**/*.md', { eager: true });  const posts = Object.values(postImportResult);  return rss({    title: 'Buzz’s Blog',    description: 'A humble Astronaut’s guide to the stars',    site: context.site,    items: posts.map((post) => ({      link: post.url,      content: sanitizeHtml(post.compiledContent()),      ...post.frontmatter,    })),  });}
```

Removing trailing slashes
-------------------------

[Section titled Removing trailing slashes](#removing-trailing-slashes)
Astro’s RSS feed produces links with a trailing slash by default, no matter what value you have configured for `trailingSlash`. This means that your RSS links may not match your post URLs exactly.


If you have set `trailingSlash: "never"` on your `astro.config.mjs`, set `trailingSlash: false` in the `rss()` helper so that your feed matches your project configuration.




src/pages/rss.xml.js


```
import rss from '@astrojs/rss';
export function GET(context) {  const posts = Object.values(postImportResult);  return rss({    title: 'Buzz’s Blog',    description: 'A humble Astronaut’s guide to the stars',    site: context.site,    trailingSlash: false,    items: posts.map((post) => ({      link: post.url,      ...post.frontmatter,    })),  });}
```

Adding a stylesheet
-------------------

[Section titled Adding a stylesheet](#adding-a-stylesheet)
Style your RSS feed for a more pleasant user experience when viewing the file in your browser.


Use the `rss` function’s `stylesheet` option to specify an absolute path to your stylesheet.







```
rss({  // ex. use your stylesheet from "public/rss/styles.xsl"  stylesheet: '/rss/styles.xsl',  // ...});
```

Tip

If you’d prefer not to create your own stylesheet, you may use a premade stylesheet such as the [Pretty Feed v3 default stylesheet](https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl). Download the stylesheet from GitHub and save into your project’s `public/` directory.


Enabling RSS feed auto\-discovery
---------------------------------

[Section titled Enabling RSS feed auto\-discovery](#enabling-rss-feed-auto-discovery)
[RSS autodiscovery](https://www.rssboard.org/rss-autodiscovery) allows browsers and other software to automatically find a site’s RSS feed from the main URL.


To enable, add a `<link>` tag with the following attributes to your site’s `head` element:







```
<link    rel="alternate"    type="application/rss+xml"    title="Your Site's Title"    href={new URL("rss.xml", Astro.site)}/>
```

With this tag, readers of your blog can enter your site’s base URL into their RSS reader to subscribe to your posts without needing the specific URL of your RSS feed.


Next Steps
----------

[Section titled Next Steps](#next-steps)
After visiting your feed in the browser at `your-domain.com/rss.xml` and confirming that you can see data for each of your posts, you can now [promote your feed on your website](https://medium.com/samsung-internet-dev/add-rss-feeds-to-your-website-to-keep-your-core-readers-engaged-3179dca9c91e#:~:text=com/~deno%2Drss-,Advertising%20your%20RSS%20feed,-Now%20you%20have). Adding the standard RSS icon to your site lets your readers know that they can subscribe to your posts in their own feed reader.


Resources
---------

[Section titled Resources](#resources)
* [RSS Feeds](https://aboutfeeds.com/)


Recipes