const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

// Lucide ships ESM-only (.mjs). Metro doesn't resolve .mjs by default.
const config = mergeConfig(defaultConfig, {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs'],
  },
});

module.exports = withNativeWind(config, { input: './global.css' });
