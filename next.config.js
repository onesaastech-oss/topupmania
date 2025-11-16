/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      'https://topupmania.com',
      'http://topupmania.com',
      'https://www.topupmania.com',
      'http://www.topupmania.com',
      'http://15.235.162.142',
      'http://api.zorotopup.com'
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;