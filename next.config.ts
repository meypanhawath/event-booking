import type { NextConfig } from "next";
import { buildApiUrl } from "./lib/api-url";

const backendUrl = process.env.NEXT_PUBLIC_API || "http://localhost:8000";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,
    },

    async rewrites() {
        return [
            {
                source: "/api/files/upload",
                destination: buildApiUrl(backendUrl, "/files/upload"),
            },
        ];
    },
};

export default nextConfig;
