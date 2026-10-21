import { useEffect } from "react";

interface PageMeta {
  /** Full tab title, including the "| TravelMate" suffix where wanted --
   *  passed as-is, not auto-suffixed, so callers can also set the
   *  unsuffixed homepage title. */
  title: string;
  description: string;
}

function upsertMeta(selector: string, create: () => HTMLMetaElement) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  return tag;
}

// Client-side-only page metadata. Real limitation, not an oversight: this is
// a Vite SPA with no SSR/prerendering, so a crawler that doesn't execute
// JavaScript (most social share-preview bots -- Facebook, Twitter/X,
// LinkedIn, Slack unfurl) only ever sees index.html's static tags,
// regardless of which route was shared. This hook covers what a client-side
// SPA can actually deliver: the browser tab title/description, and Google's
// crawler (which does render JS). See plan.md's SEO slice for the documented
// SSR/prerender decision.
export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    document.title = title;

    const descriptionTag = upsertMeta('meta[name="description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      return tag;
    });
    descriptionTag.setAttribute("content", description);

    const ogTitleTag = upsertMeta('meta[property="og:title"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:title");
      return tag;
    });
    ogTitleTag.setAttribute("content", title);

    const ogDescriptionTag = upsertMeta('meta[property="og:description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:description");
      return tag;
    });
    ogDescriptionTag.setAttribute("content", description);

    const ogUrlTag = upsertMeta('meta[property="og:url"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:url");
      return tag;
    });
    ogUrlTag.setAttribute("content", window.location.href);

    const twitterTitleTag = upsertMeta('meta[name="twitter:title"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:title");
      return tag;
    });
    twitterTitleTag.setAttribute("content", title);

    const twitterDescriptionTag = upsertMeta('meta[name="twitter:description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:description");
      return tag;
    });
    twitterDescriptionTag.setAttribute("content", description);

    let canonicalTag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", window.location.origin + window.location.pathname);
  }, [title, description]);
}
