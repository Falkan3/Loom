import build from './build';

export default Object.assign(build, {
    input: 'entry/entry-modular.js',
    output: Object.assign(build.output, {
        // file: 'dist/js/loom.modular.esm.js',
        dir: 'dist/js/esm/modular/',
        entryFileNames: 'loom.esm.js', // [name]
        chunkFileNames: '[hash].js',
        format: 'es',
    }),
    // preserveModules: true
});
