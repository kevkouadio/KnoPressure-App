/**
 * Resolve URLs for files in `public/` (Create React App). Honors PUBLIC_URL for subpath deploys.
 */
export function publicUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${process.env.PUBLIC_URL || ""}${normalized}`;
}
