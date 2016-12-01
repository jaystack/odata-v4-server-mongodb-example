"use strict";

const path = require("path");

module.exports = {
  context: path.join(__dirname, "/src/react-app"),
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "/public"),
    filename: "bundle.js"
  },
  devtool: 'source-map',
  resolve: {
    extensions: ["", ".jsx", ".js"]
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel",
        exclude: /node_modules/,
        query: {
          presets: ["react", "latest"],
          plugins: ["transform-object-rest-spread"]
        }
      },
      {
        test: /\.css$/, loader: "style!css!autoprefixer?safe=true"
      },
      {
        test: /\.json$/, loader: "json"
      }
    ]
  }
};