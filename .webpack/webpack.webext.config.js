import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";
import configShared from "./shared.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "..");

const DEBUG_MODE = process.env.NODE_ENV === "development";
const REPO_BRANCH = DEBUG_MODE ? "dev" : "master";

export default {
  mode: DEBUG_MODE ? "development" : "production",
  ...configShared,
  entry: {
    content: path.resolve(__dirname, "src", "webext", "content-wrapper.js"),
    background: path.resolve(__dirname, "src", "webext", "background.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist-webext"),
    filename: "[name].js",
    clean: true,
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.DefinePlugin({
      DEBUG_MODE,
      REPO_BRANCH: JSON.stringify(REPO_BRANCH),
      AVAILABLE_LOCALES: JSON.stringify(["en", "ru"]),
      IS_WEBEXTENSION: true,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^node:crypto$/,
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/webext/manifest.json", to: "manifest.json" },
        { from: "icons", to: "icons" },
      ],
    }),
  ],
  optimization: {
    minimize: !DEBUG_MODE,
  },
};
