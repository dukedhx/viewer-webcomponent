import { terser } from "rollup-plugin-terser";

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

let plugins = [
terser()
];


export default {
  input: 'lib/index.js',
  plugins: plugins,
  external: external,
  output: [
    {
      file:'dist/viewer-component.js',
      dest: pkg.iife,
      format: 'iife',
      moduleName: 'forge-viewer-web-component',
      sourceMap: false
    }
  ]
};
