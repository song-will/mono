import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)

const resovle = p => path.resolve(packageDir, p)
const pkg = require(resovle('package.json'))
const packageOptions = pkg.buildOptions || {}
const name = packageOptions.filename || pkg.basename(packageDir)

const outputConfigs = {
    'esm-bundler': {
        file: resovle(`dist/${name}.esm.bundler.js`),
        format: 'es'
    },
    'esm-broowser': {
        file:  resovle(`dist/${name}.esm-browser.js`),
        format: 'es'
    },
    cjs: {
        file: resovle(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    global: {
        name,
        file: resovle(`dist/${name}.global.js`),
        format: 'iife'
    }
}