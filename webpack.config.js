const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    target: 'node',
    entry: {
        index: './index.mjs',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                }]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
}