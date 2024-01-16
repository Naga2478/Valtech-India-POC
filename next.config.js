const withPWA = require('next-pwa')({
  dest: 'public'
});
const path = require('path');
const config = {
  publicRuntimeConfig: {
    // Will be available on both server and client
    CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
    CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN,
    CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT,
    CONTENTSTACK_MANAGEMENT_TOKEN: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
    CONTENTSTACK_API_HOST:
      process.env.CONTENTSTACK_API_HOST || 'api.contentstack.io',
    CONTENTSTACK_APP_HOST:
      process.env.CONTENTSTACK_APP_HOST || 'app.contentstack.com',
    NEXT_PUBLIC_CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
    CONTENTSTACK_LIVE_PREVIEW:
      process.env.NEXT_PUBLIC_CONTENTSTACK_LIVE_PREVIEW || 'true',
    CONTENTSTACK_LIVE_EDIT_TAGS:
      process.env.CONTENTSTACK_LIVE_EDIT_TAGS || 'false',
      //language configuration
    SUPPORTED_LANGUAGES: ['en-us', 'en-in'], 
    DEFAULT_LANGUAGE: 'en-us', //default language
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      //for site-specific modules
      config.resolve.alias['@site1'] = path.join(__dirname, 'packages/site1');
      config.resolve.alias['@site2'] = path.join(__dirname, 'packages/site2');
    }

    return config;
  },
};
module.exports =
  process.env.NODE_ENV === 'development' ? config : withPWA(config);
