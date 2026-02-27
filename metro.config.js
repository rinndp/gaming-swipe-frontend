// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Agregar extensiones de video
config.resolver.assetExts.push(
    'MP4',
    'mov',
    'avi',
    'webm'
  );

module.exports = config;
