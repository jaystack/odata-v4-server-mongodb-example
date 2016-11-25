module.exports = {
  context: __dirname + "/src/app",
  entry: "./app.jsx",
  output: {
    path: __dirname + "/public",
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
          presets: ["react", "es2015"],
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