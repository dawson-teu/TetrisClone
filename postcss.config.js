module.exports = {
    map: { inline: false },
    plugins: [
        require('autoprefixer')({ grid: 'autoplace' }),
        require('colorguard')({ allowEquivalentNotation: true, threshold: 2 }),
        require('postcss-preset-env')({
            stage: 3,
            autoprefixer: false,
            features: {
                'image-set-function': { preserve: false, oninvalid: 'warning' },
                'rebeccapurple-color': true,
                'system-ui-font-family': true,
                'overflow-wrap-property': true,
                'gray-function': true,
                'hexadecimal-alpha-notation': true,
            },
        }),
    ],
};
