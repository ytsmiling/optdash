var path = require('path');
var webpack = require('webpack');
var APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
    entry: APP_DIR + '/index.tsx',
    output: { path: __dirname + "/public", filename: 'bundle.js' },
    mode: "development",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css"],
    },
    module: {
        rules: [{
                test: /\.(ts|tsx)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'],
            }
        ]
    },
};