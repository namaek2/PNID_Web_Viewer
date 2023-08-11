const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["./src/fabric.js", "./src/xmlReader.js"],
  output: {
    // 최종 번들링된 자바스크립트
    filename: "main.js",
    // dist를 배포용 폴더로 사용
    path: path.resolve(__dirname, "dist"),
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // index.html을 기본 템플릿으로 반영할 수 있도록 설정
    }),
  ],

  devServer: {
    // 개발 서버가 dist 폴더를 제공할 수 있도록 설정
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    client: {
      overlay: false, // 오류 발생 시 브라우저 화면에 표시
    },
    port: 8080,
  },
};
