import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**", search: "" },
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/u/94336773", search: "?v=4" },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/shawnesquivel/shawnesquivel.com/main/public/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
