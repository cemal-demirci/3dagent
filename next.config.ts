import withSerwist from "@serwist/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default withSerwist({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
