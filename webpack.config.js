var path = require("path");

module.exports = {
  mode: "none",
  entry: "./src/js/script.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: "./dist",
    hot: true,
  },
};
