const path = require('path');

module.exports = {
  mode: "production",
  entry: {
      background: './src/background.js', // replace with path to your background.js or main script file
      content: './src/content.js', 
      popup: './src/popup.js'
  },
  
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  devtool: "source-map",
  resolve: {
    fallback: {
      "https": require.resolve("https-browserify"),
      "assert": require.resolve("assert/"),
      "util": require.resolve("util/"),
      "url": require.resolve("url/"),
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer/"),
      "zlib": require.resolve("browserify-zlib"),
      "path": require.resolve("path-browserify"),
      "fs": require.resolve("browserify-fs"),
      "tls": false, // Set to false if there is no browser equivalent
      "net": false // Set to false if there is no browser equivalent
    }
  }
};
