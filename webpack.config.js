const path = require("path"); //노드 모듈 중에 path를 가져와서 사용
const HtmlWebpackPlugin = require("html-webpack-plugin"); //html을 빌드하기 위한 플러그인

module.exports = {
  target: "web",
  devServer: {
    // dist 디렉토리를 웹 서버의 기본 호스트 위치로 설정
    contentBase: path.resolve(__dirname, "./src"),
    // 인덱스 파일 설정
    index: "index.html",
    // 포트 번호 설정
    port: 9000,
    // 핫 모듈 교체(HMR) 활성화 설정
    hot: true,
    // gzip 압축 활성화
    compress: true,
    // dist 디렉토리에 실제 파일 생성
    writeToDisk: true,
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
    ],
  },

  mode: "development",
  entry: ["./src/fabric.js", "./src/xmlReader.js"],
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  module: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
