import type { NextConfig } from "next";
import { withGluestackUI } from "@gluestack/ui-next-adapter";
import withPWA from "next-pwa";

const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'szlxwnautzzqyrsnlenr.supabase.co',
      },
    ],
  },
  transpilePackages: [
    "nativewind",
    "react-native-css-interop",
    "@react-native/assets-registry",
  ],
};

const withGluestack = withGluestackUI(baseConfig);

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(withGluestack);
