module.exports = {
  babel: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      'babel-plugin-transform-typescript-metadata',
      // 기타 필요한 플러그인들...
    ],
  },
};
