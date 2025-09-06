const moduleResolver = require('./babel-plugin-module-resolver');

module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [moduleResolver, { alias: { '@': '.' } }]
  ]
};
