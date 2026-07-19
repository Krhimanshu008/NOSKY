/**
 * Securely sanitizes an object into a JSON string suitable for inclusion in an HTML `<script>` tag.
 * It prevents Cross-Site Scripting (XSS) by replacing HTML-sensitive characters with their Unicode equivalents.
 *
 * @param {Object} obj The object to serialize.
 * @returns {string} The sanitized JSON string.
 */
export function sanitizeJsonLd(obj) {
  if (!obj) return '{}';

  // Convert object to JSON string and escape potential XSS characters
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
