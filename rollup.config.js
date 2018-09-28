import pkg from './package.json'
import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import { uglify } from 'rollup-plugin-uglify'

const input = 'src/index.js'

const external = [
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
]

const babelOptions = {
  exclude: 'node_modules/**',
  runtimeHelpers: true,
}

const globals = {
  'react': 'React',
  '@babel/runtime/helpers/extends': '_extends',
  '@babel/runtime/regenerator': '_regeneratorRuntime',
  '@babel/runtime/helpers/asyncToGenerator': '_asyncToGenerator',
  '@babel/runtime/helpers/inheritsLoose': '_inheritsLoose',
  '@babel/runtime/helpers/assertThisInitialized': '_assertThisInitialized',
}

export default (() => {

  switch (process.env.NODE_ENV) {

    case 'development': {
      return {
        input,
        output: {
          file: pkg.module,
          format: 'esm',
          exports: 'named',
        },
        external,
        plugins: [
          eslint(),
          resolve(),
          babel(babelOptions),
        ],
      }
    }

    case 'production': {
      return [

        {
          input,
          output: {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
          },
          external,
          plugins: [
            resolve(),
            babel(babelOptions),
            sizeSnapshot(),
          ],
        },
    
        {
          input,
          output: {
            file: pkg.module,
            format: 'esm',
            exports: 'named',
          },
          external,
          plugins: [
            resolve(),
            babel(babelOptions),
            sizeSnapshot(),
          ],
        },
    
        {
          input,
          output: {
            file: pkg.unpkg,
            format: 'umd',
            name: 'StateMint',
            globals,
          },
          external,
          plugins: [
            resolve({
              browser: true,
            }),
            babel(babelOptions),
            sizeSnapshot(),
          ],
        },
    
        {
          input,
          output: {
            file: 'lib/state-mint.min.js',
            format: 'umd',
            name: 'StateMint',
            globals,
          },
          external,
          plugins: [
            resolve({
              browser: true,
            }),
            babel(babelOptions),
            uglify(),
            sizeSnapshot(),
          ],
        },

      ]
    }

    default: {
      console.error('must set build environment')
      process.exit(1)
    }

  }

})()