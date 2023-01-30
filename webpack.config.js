const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
var webpack = require("webpack");
module.exports = {
    entry: './src/index.jsx',
    optimization: {
        minimizer: [
            new TerserPlugin(),
        ],
    },
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'index.js',
        //libraryTarget: "commonjs2"
    },
    devtool: 'cheap-eval-source-map', // won't work on XD due to lack of eval
    externals: {
        uxp: 'commonjs2 uxp',
        photoshop: 'commonjs2 photoshop',
        os: 'commonjs2 os',
        fs: 'commonjs2 fs',
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/, /BatchPlay_Files/, /backend/, /build/],
                loader: "babel-loader",
                options: {
                    plugins: [
                        "@babel/transform-react-jsx",
                        "@babel/proposal-object-rest-spread",
                        "@babel/plugin-syntax-class-properties",
                    ]
                }
            },
            {
                test: /\.png$/,
                exclude: /node_modules/,
                loader: 'file-loader'
            },

            {
                test: /\.sass$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin(['plugin'], {
            copyUnmodified: true
        })
    ]
};