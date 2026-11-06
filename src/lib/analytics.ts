import { track } from "@vercel/analytics";

type Props = Record<string, string | number | boolean | null>;

export function trackEvent(name: string, props?: Props) {
  try {
    track(name, props);
  } catch {
    // Analytics must never break the page.
  }
}

/** Fires an event at most once per browser session. */
export function trackOnce(key: string, name: string, props?: Props) {
  try {
    const id = `lode:${key}`;
    if (sessionStorage.getItem(id)) return;
    sessionStorage.setItem(id, "1");
  } catch {
    // Private mode or storage disabled: fall through and send once per page load instead.
  }
  trackEvent(name, props);
}
