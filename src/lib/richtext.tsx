import DOMPurify from "isomorphic-dompurify";

/** Renderiza HTML confiável (vindo do TipTap no admin) de forma sanitizada. */
export function RichText({ html, className }: { html: string; className?: string }) {
  const clean = DOMPurify.sanitize(html);
  return (
    <div
      className={`prose-jnm ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
