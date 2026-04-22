import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_API || "http://localhost:8000";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,
    },

    async rewrites() {
        return [
            {
                source: "/api/auth/register",
                destination: `${backendUrl}/auth/register`,
            },
            {
                source: "/api/:path*",
                destination: `${backendUrl}/:path*`,
            },
        ];
    },
};

export default nextConfig;