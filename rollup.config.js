import pkg from './package.json'
import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {

  input: 'src/index.js',

  output: [{
    file: pkg.main,
    format: 'cjs',
    exports: 'named',
  }, {
    file: pkg.module,
    format: 'esm',
    exports: 'named',
  }],

  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    // suppress `babel-runtime`-related errors
    '@babel/runtime/helpers/inheritsLoose',
    '@babel/runtime/helpers/assertThisInitialized',
    '@babel/runtime/helpers/defineProperty',
    '@babel/runtime/helpers/extends',
    '@babel/runtime/helpers/wrapNativeSuper',
    '@babel/runtime/regenerator',
    '@babel/runtime/helpers/asyncToGenerator',
  ],

  plugins: [

    eslint(),

    resolve(),

    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),

  ],

}