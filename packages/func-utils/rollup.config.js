// rollup.config.js  
import typescript from 'rollup-plugin-typescript2';  
import commonjs from '@rollup/plugin-commonjs';  
import resolve from '@rollup/plugin-node-resolve';  
  
export default {  
  input: 'src/index.ts',  
  output: [  
    {  
      file: 'dist/es/func-utils.es.js',  
      format: 'es',  
      sourcemap: true,  
    },  
    {  
      file: 'dist/cjs/func-utils.cjs.js',  
      format: 'cjs',  
      sourcemap: true,  
    },  
    {
      file: 'dist/umd/func-utils.umd.js',  
      format: 'umd',  
      sourcemap: true,
      name: '_$'
    },
    {
      file: 'dist/iife/func-utils.iife.js',  
      format: 'iife',  
      sourcemap: true,  
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