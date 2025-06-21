import invariant from 'tiny-invariant';

import type {NextConfig} from 'next';
import type {Configuration} from 'webpack';

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config: Configuration) {
    invariant(config.module, 'module should be available');
    invariant(config.module.rules, 'rules should be available');
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;
