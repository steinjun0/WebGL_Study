var path = require("path");

module.exports = {
  mode: "none",
  target: ["web", "es2020"],
  entry: ["./src/js/script.js", "./src/js/mediaPipe.js"],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: "./dist",
    hot: true,
  },
};
