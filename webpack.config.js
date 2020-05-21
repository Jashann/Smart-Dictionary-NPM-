const path = require("path");

module.exports = {
    //Webpack
    entry: ["babel-polyfill","./src/index.js"],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname,"dist")
    },

    //Babel
    module: {
        rules: [
          { 
            test: /\.js$/, 
            exclude: /node_modules/, 
            loader: "babel-loader" 
          }
        ]
    },


    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000
    }
}