module.exports = {
    sourceMaps: 'both',
    plugins: [
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-transform-instanceof',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
    presets: [
        '@babel/preset-react',
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: '3.6',
            },
        ],
    ],
};
