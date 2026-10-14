import { ImageResponse } from "next/og";
import { photo } from "@/lib/og";

// iOS home-screen icon generated from your photo. iOS rounds the corners itself.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photo} width={size.width} height={size.height} alt="" />
    ),
    size,
  );
}
