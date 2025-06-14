const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  stream: require.resolve('stream-browserify'),
  events: require.resolve('events-browserify'),
};

module.exports = config;