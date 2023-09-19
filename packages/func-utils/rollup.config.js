// rollup.config.js  
import typescript from 'rollup-plugin-typescript2';  
import commonjs from '@rollup/plugin-commonjs';  
import resolve from '@rollup/plugin-node-resolve';  
  
export default {  
  input: 'src/index.ts',  
  output: [  
    {  
      file: 'dist/func-utils.es.js',  
      format: 'es',  
      sourcemap: true,  
    },  
    {  
      file: 'dist/func-utils.cjs.js',  
      format: 'cjs',  
      sourcemap: true,  
    },  
    {
      file: 'dist/func-utils.umd.js',  
      format: 'umd',  
      // sourcemap: true,
      name: '_$'
    },
    {
      file: 'dist/func-utils.iife.js',  
      format: 'iife',  
      // sourcemap: true,  
      name: '_$'
    }
  ],  
  plugins: [  
    typescript({  
      tsconfig: './tsconfig.json',  
    }),  
    commonjs(),  
    resolve(),  
  ],
};