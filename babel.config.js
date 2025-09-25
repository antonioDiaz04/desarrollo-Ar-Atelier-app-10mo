module.exports = function (api) {
  api.cache(true);
  let plugins = [
      'react-native-worklets-core/plugin', // <-- Añade esta línea
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};
