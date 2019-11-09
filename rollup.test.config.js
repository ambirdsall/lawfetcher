import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import toES5 from '@rollup/plugin-buble'
import multiEntry from 'rollup-plugin-multi-entry'

export default {
  input: 'tests/**/*.spec.js',
  output: {
    format: 'iife',
    sourcemap: 'inline'
  },
  plugins: [ resolve(), commonjs(), toES5(), multiEntry() ]
}
