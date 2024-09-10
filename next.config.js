/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async headers() {
      return [
        {
          source: '/manifest.json',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/json',
            },
          ],
        },
        {
          source: '/service-worker.js',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/javascript',
            },
          ],
        },
      ];
    },
  };

  module.exports = nextConfig;
