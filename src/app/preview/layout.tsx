import type { Metadata } from "next";
import type { ReactNode } from "react";

/* Design previews for review. Not linked from the site and kept out of search. */
export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null },
};

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return children;
}
