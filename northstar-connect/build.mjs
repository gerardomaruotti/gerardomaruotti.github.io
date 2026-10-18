import { build } from 'esbuild';
await build({ entryPoints: ['src/app.js'], bundle: true, minify: true, format: 'esm', target: 'safari17', outfile: 'assets/app.js', legalComments: 'linked' });
