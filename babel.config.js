module.exports = {
    exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
    presets: [
        [
            '@babel/preset-env',
            {
                // useBuiltIns: 'usage',
                // corejs: 3,
                // targets: { esmodules: true }
            }
        ]
    ],
    plugins: [
        'add-module-exports',
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-proposal-class-properties',
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    '@src': './src',
                    '@libs': './src/libs',
                    '@components': './src/components',
                    '@core': './src/core',
                    '@utils': './src/utils',
                    '@assets': './src/assets'
                }
            }
        ]
    ]
};
