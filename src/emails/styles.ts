import type { CSSProperties } from "react";

// Email-client-safe styles: inline, system fonts, no background colours that
// fight dark mode. Letter-like, not a copy of the website.

export const font =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const body: CSSProperties = {
  margin: 0,
  padding: "24px 0",
  fontFamily: font,
  color: "#1a1a1a",
};

export const container: CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "0 20px",
};

export const text: CSSProperties = {
  fontSize: "17px",
  lineHeight: "1.65",
  margin: "0 0 20px",
};

export const muted: CSSProperties = {
  color: "#6b6b6b",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 8px",
};

export const link: CSSProperties = { color: "#0b57d0", textDecoration: "underline" };

export const hr: CSSProperties = { border: "none", borderTop: "1px solid #e6e6e6", margin: "32px 0" };
