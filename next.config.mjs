/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ngesxn.weebly.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: 'img.youtube.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'mxmzlgtpvuwhhpsjmxip.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: { loader: '@svgr/webpack', options: { icon: true }}
    });

    return config;
  },
};

export default nextConfig;
