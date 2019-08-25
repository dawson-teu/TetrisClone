const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/game.ts',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
      },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'webpack.*')],
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.jsx?$/,
                include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'webpack.*')],
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/game.html'),
            filename: path.resolve(__dirname, 'build/game.html'),
        }),
    ],
};
