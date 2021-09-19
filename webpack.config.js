var path = require("path");

module.exports = {
  mode: "development",
  entry: ["./src/js/script.js", "@mediapipe/face_mesh"],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: ["./dist", "./node_modules/@mediapipe/face_mesh"], // face_mesh 내부 파일들 serve
    hot: true,
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', '.css', '.binarypb'],
  },
};
