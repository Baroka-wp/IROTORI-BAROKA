/**
 * Sanitisation HTML côté serveur — protection XSS stocké.
 * Supprime les vecteurs XSS courants du contenu riche produit par TipTap :
 *   - balises <script>, <iframe>, <object>, <embed>, <form>
 *   - attributs on* (onclick, onerror, onload, …)
 *   - href/src avec javascript: ou data: scheme
 */
export function sanitizeHtml(raw: string): string {
  if (!raw) return raw;

  return raw
    // Balises dangereuses (avec tout leur contenu pour script/iframe)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, '')
    // Attributs événements inline (on*)
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    // javascript: et data: dans href / src / action / formaction
    .replace(/\b(href|src|action|formaction)\s*=\s*["']?\s*(?:javascript|data)\s*:/gi, '$1="#"')
    // expression() dans style (IE)
    .replace(/style\s*=\s*["'][^"']*expression\s*\([^)]*\)[^"']*["']/gi, '');
}
