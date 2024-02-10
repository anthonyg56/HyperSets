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
      }
    ]
  }
};

export default nextConfig;
