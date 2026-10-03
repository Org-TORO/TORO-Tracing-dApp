import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: no `output: "export"` here on purpose. Static export can only
  // render the lot codes listed in generateStaticParams(), so any unknown
  // scan (e.g. /explorer/TORO-xyz) would throw "missing param" instead of
  // reaching the unverified-product warning. Without it, known lots are
  // still pre-rendered and unknown codes render on demand.
  // NOTE: `distDir` stays at the Next.js default (".next"). A custom dir
  // breaks Vercel deploys (it looks for `.next/routes-manifest.json`).
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
