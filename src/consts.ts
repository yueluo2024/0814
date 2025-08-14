// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// Base Page Metadata, src/layouts/BaseLayout.astro
export const BRAND_NAME = "AstroMelody";
export const SITE_TITLE = "AstroMelody";
export const SITE_DESCRIPTION = "An Astro Theme for Visual Storytelling";
export const LIGHT_THEME = 'corporate';
export const DARK_THEME = 'halloween';

// Tags Page Metadata, src/pages/tags/index.astro
export const Tags_TITLE = "AstroMelody - All Tags";
export const Tags_DESCRIPTION =
  "AstroMelody - All tags and the count of articles related to each tag";

// Tags Page Metadata, src/pages/tags/[tag]/[page].astro
export function getTagMetadata(tag: string) {
  return {
    title: `All articles on '${tag}' tag in AstroMelody`,
    description: `Explore articles about ${tag} for different perspectives and in-depth analysis.`,
  };
}

// Category Page Metadata, src/pages/category/[category]/[page].astro
export function getCategoryMetadata(category: string) {
  return {
    title: `All articles in '${category}' category in AstroMelody`,
    description: `Browse all articles under the ${category} category in AstroMelody`,
  };
}

// Header Links, src/components/Header.astro
export const HeaderLinks = [
  { href: "/category/One/1/", title: "One" },
  { href: "/category/Two/1/", title: "Two" },
  { href: "/category/Three/1/", title: "Three" },
];

// Footer Links, src/components/Footer.astro
export const FooterLinks = [
  { href: "/posts/core-concepts-concepts-why-astro/", title: "Astro" },
  { href: "/posts/assets-guides-styling/", title: "Styling" },
  { href: "/tags/", title: "Tags" },
];

// Social Links, src/components/Footer.astro
export const SocialLinks = [
  { href: "/rss.xml", icon: "icon-[tabler--rss]", label: "RSS" },
  {
    href: "https://twitter.com/astrodotbuild",
    icon: "icon-[tabler--brand-twitter]",
    label: "Twitter",
  },
  {
    href: "https://github.com/ouranoshong/astro-melody-starter",
    icon: "icon-[tabler--brand-github]",
    label: "GitHub",
  },
];

// Search Page Metadata, src/pages/search.astro
export const SEARCH_PAGE_TITLE = `${SITE_TITLE} - Site Search`;
export const SEARCH_PAGE_DESCRIPTION = `Search all content on ${SITE_TITLE}`;
