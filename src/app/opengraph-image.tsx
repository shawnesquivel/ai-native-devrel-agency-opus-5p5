import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fonts = join(process.cwd(), "node_modules/geist/dist/fonts");

export default async function Image() {
  const [semibold, mono] = await Promise.all([
    readFile(join(fonts, "geist-sans/Geist-SemiBold.ttf")),
    readFile(join(fonts, "geist-mono/GeistMono-Regular.ttf")),
  ]);

  const line = "#e2e0d8";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f4ef",
          color: "#121211",
          fontFamily: "Geist",
          padding: 72,
          position: "relative",
        }}
      >
        {[300, 600, 900].map((x) => (
          <div key={x} style={{ position: "absolute", left: x, top: 0, bottom: 0, width: 1, background: line }} />
        ))}
        {[210, 420].map((y) => (
          <div key={y} style={{ position: "absolute", top: y, left: 0, right: 0, height: 1, background: line }} />
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="44" height="44" viewBox="0 0 24 24">
            <rect x="7" y="3" width="10" height="5" rx="1" fill="#121211" />
            <rect x="3.5" y="9.5" width="17" height="5" rx="1" fill="#ff4f1a" />
            <rect x="0" y="16" width="24" height="5" rx="1" fill="#121211" />
          </svg>
          <div style={{ fontSize: 38, letterSpacing: -1.2 }}>{SITE.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Geist Mono",
              fontSize: 24,
              textTransform: "uppercase",
              letterSpacing: 3,
              color: "#3b3a36",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ width: 14, height: 14, background: "#ff4f1a" }} />
            {SITE.eyebrow}
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.04, letterSpacing: -3.4, marginTop: 28 }}>
            <div style={{ display: "flex" }}>
              <div>You built something</div>
              <div style={{ display: "flex", position: "relative", marginLeft: 20 }}>
                agents
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 2, height: 7, background: "#ff4f1a" }} />
              </div>
            </div>
            <div>want.</div>
            <div style={{ color: "#66655f" }}>We make sure agents can find you.</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
