// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    verbose: true,
    testEnvironment: 'jsdom',

    // Explicitly list accepted extensions
    moduleFileExtensions: ['js', 'json', 'jsx', 'mjs', 'ts', 'tsx'],

    // Update the transform regex to match .mjs files
    transform: {
        // This regex matches: .js, .jsx, .mjs, .ts, .tsx
        '^.+\\.[jt]sx?|mjs$': [
            'babel-jest',
            {
                // This forces babel-jest to look up babel.config.js
                babelrc: true,
            }
        ],
    },
};

export default config;
