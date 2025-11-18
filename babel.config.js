import aliases from './aliases.js';

/**
 * File: babel.config.js
 * Project-wide Babel configuration using ES Module syntax.
 *
 * Configuration is determined by the BABEL_ENV or NODE_ENV environment variable.
 */

export default {
    env: {
        // --- Development Environment Configuration ---
        development: {
            // Note: The 'exclude' property in .babelrc is often meant for
            // a custom Babel loader or tool and not a standard Babel API option.
            // If it's intended for preset-env, it should be within the preset options.
            // exclude: ["node_modules/@babel/**", "node_modules/core-js/**"],

            presets: [
                [
                    '@babel/preset-env',
                    {
                        // useBuiltIns: 'usage',
                        // corejs: 3,
                        // targets: { esmodules: true }
                    }
                ],
            ],
            plugins: [
                'add-module-exports',
                '@babel/plugin-transform-object-assign',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-import-assertions',
                [
                    'module-resolver',
                    {
                        root: ['./'],
                        alias: aliases
                    }
                ]
            ]
        },

        // --- Production Environment Configuration ---
        production: {
            // exclude: ["node_modules/@babel/**", "node_modules/core-js/**"],

            presets: [
                // Warning: "env" is likely a deprecated or custom preset.
                // It's listed alongside the modern "@babel/preset-env".
                'env', // POTENTIALLY DEPRECATED/CUSTOM
                'minify', // Assumes you have "babel-preset-minify" installed
                '@babel/preset-env' // Modern standard preset
            ],
            plugins: [
                'add-module-exports',
                '@babel/plugin-transform-object-assign',
                '@babel/plugin-proposal-class-properties',
                [
                    'module-resolver',
                    {
                        root: ['./'],
                        alias: aliases
                    }
                ]
            ]
        },
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {}
                ]
            ],
            plugins: [
                // **Crucial for your setup:** Keep the `module-resolver` for path aliasing
                // and any other necessary plugins for transpiling syntax (like class properties).
                // Ensure all plugins needed for test syntax are listed here.
                'add-module-exports',
                '@babel/plugin-transform-object-assign',
                '@babel/plugin-proposal-class-properties',
                [
                    'module-resolver',
                    {
                        root: ['./'],
                        alias: aliases
                    }
                ]
            ]
        }
    }
};
