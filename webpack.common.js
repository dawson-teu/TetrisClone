const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/game.ts'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [path.resolve(__dirname, 'src')],
                use: ['ts-loader'],
            },
            {
                test: /\.jsx?$/,
                include: [path.resolve(__dirname, 'src')],
                use: ['babel-loader'],
            },
            {
                test: /\.html$/,
                include: [path.resolve(__dirname, 'src')],
                use: ['html-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                include: [path.resolve(__dirname, 'src')],
                use: {
                    loader: 'file-loader',
                    options: { name: '[path][name].[ext]', context: 'src/' },
                },
            },
            {
                test: /\.css$/,
                include: [path.resolve(__dirname, 'src')],
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/game.html'),
            filename: path.resolve(__dirname, 'build/game.html'),
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
};
