import typescript2 from 'rollup-plugin-typescript2'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packagesDir = path.resolve(__dirname, '../packages', )

const resolve = args => path.resolve(packagesDir, args)
const resolveInput = pkg => path.resolve(packagesDir, pkg, 'src', 'index.ts')
const resolveOutput = (pkg, format) => path.resolve(packagesDir, pkg, 'dist', `${pkg}.${format}.js`)

// 字符转驼峰函数
const camelize = str => str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
console.log({
    __dirname,
    packagesDir
})

export default commandLineArgs => {
    const { pkgName } = commandLineArgs;
    console.log({
        pkgName
    })
    // 这会使 Rollup 忽略命令行参数
    // delete commandLineArgs.input;
    return {
        input: resolveInput(pkgName),
        output: [
            {
                file: resolveOutput(pkgName, 'es'),
                format: 'es'
            },
            {
                file: resolveOutput(pkgName, 'cjs'),
                format: 'cjs'
            },
            {
                file: resolveOutput(pkgName, 'umd'),
                format: 'umd',
                name: camelize(pkgName)
            },
            {
                file: resolveOutput(pkgName, 'iife'),
                format: 'iife',
                name: camelize(pkgName)
            }
        ],
        plugins: [
            typescript2({
                include: packagesDir,
                // tsconfig: path.resolve(__dirname, '../tsconfig.json')
            })
        ],
    }
  }
