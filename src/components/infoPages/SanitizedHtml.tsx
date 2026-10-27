import { useMemo } from "react";
import DOMPurify from "dompurify";

type SanitizedHtmlProps = {
  html: string;
  className?: string;
};

// Renders CMS-authored HTML. Sanitising strips scripts, event handlers and
// javascript: URLs, so a compromised CMS entry can't run code on our domain.
export const SanitizedHtml = ({ html, className }: SanitizedHtmlProps) => {
  const safeHtml = useMemo(() => DOMPurify.sanitize(html), [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
};
