import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "./site";

/** The author photo as a data URL, for images rendered with ImageResponse. */
export const photo = `data:image/jpeg;base64,${fs
  .readFileSync(path.join(process.cwd(), "public", site.author.photo))
  .toString("base64")}`;

export const ogSize = { width: 1200, height: 630 };

// Rendered once at build time into a static PNG.
export function ogImage({ title, subtitle }: { title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#ffffff",
          color: "#1a1a1a",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 32, color: "#6b6b6b", lineHeight: 1.35 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, color: "#6b6b6b" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} width={72} height={72} alt="" style={{ borderRadius: 36 }} />
            {site.author.name}
          </span>
          <span>{new URL(site.url).hostname}</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
