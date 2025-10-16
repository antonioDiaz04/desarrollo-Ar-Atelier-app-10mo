module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/jest-setup.js'],
    // Allow transforming some node_modules that ship untranspiled code (Flow/ESM/TS)
    transformIgnorePatterns: [
      "node_modules/(?!(react-native|@react-native|@react-native-community|@react-native-async-storage|@react-native-svg|react-native-heroicons|react-router-native|react-router|react-native-css-interop|@expo|expo-linear-gradient)/)"
    ],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest'
  }
};
