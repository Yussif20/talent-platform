/**
 * A destination in the header, mobile menu or footer.
 *
 * Navigation used to hardcode the forms app's three routes, which is why the dashboard
 * -- which imported the same component -- ended up commenting out both its desktop and
 * mobile navigation entirely rather than shipping links to pages it does not have.
 * Passing the links in lets one component serve both apps.
 */
export interface NavLink {
  /** Already-translated label. */
  name: string;
  /** Locale-prefixed path, e.g. `/ar/parent-form`. */
  href: string;
}
