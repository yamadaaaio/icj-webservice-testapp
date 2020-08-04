/* eslint-disable no-undef */
// Custom webpack configuration file, provides generation of service worker
// More information: https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
const webpack = require('webpack');

// Load env file
require('dotenv').config();

module.exports = {
    output: {
        publicPath: './'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify({
                ...process.env
            })
        })
    ]
};
