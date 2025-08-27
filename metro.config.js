const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;

const config = {
  resolver: {
    // Tek kopya React kullan: her şeyi app'in node_modules'undaki React'a yönlendir
    extraNodeModules: {
      react: path.resolve(projectRoot, 'node_modules/react'),
      'react/jsx-runtime': path.resolve(projectRoot, 'node_modules/react/jsx-runtime.js'),
      // react-native-web kullanıyorsak:
      'react-dom': path.resolve(projectRoot, 'node_modules/react-dom'),
      // Reanimated için resolver
      'react-native-reanimated': path.resolve(projectRoot, 'node_modules/react-native-reanimated'),
    },
    // Monorepo/symlink senaryolarında yardımcı:
    unstable_enableSymlinkResolution: true,
  },
};

module.exports = getDefaultConfig(projectRoot);


