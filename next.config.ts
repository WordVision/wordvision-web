import type { NextConfig } from "next";
import { withGluestackUI } from "@gluestack/ui-next-adapter";
import withPWA from "next-pwa";

const baseConfig: NextConfig = {
  transpilePackages: ["nativewind", "react-native-css-interop"],
};

const withGluestack = withGluestackUI(baseConfig);

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(withGluestack);
