module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {},
                useBuiltIns: 'usage',
                corejs: '3.1',
            },
        ],
    ],
};
