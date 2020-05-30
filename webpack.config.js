const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

/* code splitting option remove if unused
module.exports = {
    entry: {
        about: './src/about.js',
        contact: './src/contact.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

    */


module.exports = {
    entry:  './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
 /*   optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },*/
    plugins: [new HTMLWebpackPlugin()],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
              test: /\.css$/,
              use: [
                  { loader: 'style-loader' }, 
                  { loader: 'css-loader' }
              ]  
            },
            {
                test: /\.(png|jpg)$/,
                use: [
                    {loader: 'url-loader'}
                ]
            }
        ]
    }
}