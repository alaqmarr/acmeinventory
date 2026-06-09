export function slugify(text: string): string {
  return text.toString().toLowerCase().trim() /* Replace spaces, non-word characters, and underscores with a hyphen */
.replace(/[\s_]+/g, "-") /* Remove all non-word chars */
.replace(/[^\w-]+/g, "") /* Replace multiple hyphens with a single hyphen */
.replace(/--+/g, "-") /* Remove trailing hyphens */
.replace(/^-+|-+$/g, "");
}
export function generateId(prefix: string, identifier: string): string {
  const slug = slugify(identifier); /* Optional: add a short random string if we absolutely need uniqueness, but per the user's request we avoid random IDs where possible. We'll rely on the schema unique constraints (like SKU) to prevent conflicts, or append timestamps for events (like sales). */
return `${prefix}-${slug}`;
}
