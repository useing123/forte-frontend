module.exports = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://forte-hackathon-core-forte-hackathon-shoe.fin1.bult.app/:path*',
          },
        ]
      },
  };
