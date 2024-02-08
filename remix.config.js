/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: 'app',
  ignoredRouteFiles: ['**/.*'],
  watchPaths: ['./public', './.env'],
  server: './server.ts',
  tailwind: true,
  postcss: true,
  optimize: {
    bundle: {
      external: {
        include: [
          '/public/fonts/Gilroy-Bold.woff2',
          '/public/fonts/Gilroy-Light.woff2',
          '/public/fonts/Gilroy-Medium.woff2',
          '/public/fonts/Gilroy-Regular.woff2',
          '/public/fonts/Gilroy-SemiBold.woff2',
        ],
      },
    },
  },
  /**
   * The following settings are required to deploy Hydrogen apps to Oxygen:
   */
  publicPath: (process.env.HYDROGEN_ASSET_BASE_URL ?? '/') + 'build/',
  assetsBuildDirectory: 'dist/client/build',
  serverBuildPath: 'dist/worker/index.js',
  serverMainFields: ['browser', 'module', 'main'],
  serverConditions: ['worker', process.env.NODE_ENV],
  serverDependenciesToBundle: 'all',
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  serverMinify: process.env.NODE_ENV === 'production',
};
