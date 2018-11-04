const path = require("path");
const webpack = require("webpack");

const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: {
        background: "./src/js/background.js",
        content: "./src/js/content.js",
        popup: "./src/js/popup.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].js"
    },
    plugins: [
        new CopyWebpackPlugin(["assets", "manifest.json"], {})
    ],
    devtool: 'sourcemap'
};
