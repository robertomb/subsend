import { ImageResponse } from "next/og";
import { photo } from "@/lib/og";

// Favicon generated at build time from your photo (site.config.ts → author.photo).
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <img src={photo} width={size.width} height={size.height} alt="" style={{ borderRadius: "50%" }} />
    ),
    size,
  );
}
