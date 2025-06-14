const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    ui: './src/ui/index.tsx',
    content_script: './src/content_script/main.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' },
      ],
    }),
  ],
};