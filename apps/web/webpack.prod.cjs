const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/main.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/[name].[contenthash].js",
    publicPath: "/",
    clean: true,
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@app/shared": path.resolve(__dirname, "../../shared/src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [
              ["@babel/preset-env", { targets: { esmodules: true }, modules: false }],
              ["@babel/preset-react", { runtime: "automatic", development: false }],
              ["@babel/preset-typescript", {}],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              url: {
                filter: (url) => !url.startsWith("/images/"),
              },
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        type: "asset/resource",
        generator: { filename: "assets/images/[name].[contenthash][ext]" },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
      minify: true,
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].[contenthash].css",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
    new webpack.DefinePlugin({
      "process.env.API_BASE_URL": JSON.stringify(
        process.env.API_BASE_URL || "http://localhost:3001",
      ),
    }),
  ],
  optimization: {
    splitChunks: { chunks: "all" },
    runtimeChunk: "single",
    sideEffects: true,
    usedExports: true,
    concatenateModules: true,
  },
};
