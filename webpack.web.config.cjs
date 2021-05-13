const getConfig = require('startupjs/bundler/webpack.web.config.cjs')

const conf = getConfig(undefined, {
  forceCompileModules: [],
  alias: {},
  mode: 'react-native'
})

conf.module.rules.push({
  test: /\.less$/,
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'less-loader',
      options: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  ]
})

module.exports = conf
