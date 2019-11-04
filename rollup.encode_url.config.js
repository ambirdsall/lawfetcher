import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import toES5 from '@rollup/plugin-buble'

export default {
  input: 'js/encode_url.js',
  output: {
    format: 'iife'
  },
  plugins: [ resolve(), commonjs(), toES5() ]
}
