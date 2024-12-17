import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${process.env.STRAPI_BACKEND_URL}/api/:path*`, // Proxy to Backend
      },
      {
        source: "/uploads/:path*",
        destination: `${process.env.STRAPI_BACKEND_URL}/uploads/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default withNextIntl(nextConfig);
