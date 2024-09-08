/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports == {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/checkout',
        permanent: true,
      },
    ]
  },
}
