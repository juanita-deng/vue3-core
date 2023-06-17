// 通过rollup进行打包文件
//1.引入相关依赖
import ts from "rollup-plugin-typescript2";//解析ts
import json from "@rollup/plugin-json";
import resolvePlugin from "@rollup/plugin-node-resolve";// 解析第三方插件
import path from 'path'// 处理路径

//2.获取打包文件(路径)
//2.1.获取需要打包的包
const packagesDir = path.resolve(__dirname,'packages');// __dirname:拿到当前路径的绝对路径
const packageDir = path.resolve(packagesDir, process.env.TARGET)
//2.2.打包获取到每个包的项目配置
const resolve = p => path.resolve(packageDir,p)// 拿到每个包里的packjson
const res = resolve('package.json')
const pkg = require(res)// 获取json文件
const packageOptions = pkg.buildOptions || {} // package.json中的配置项
// console.log(packageOptions, '999-----')// 要想在父包里看到子包信息,需要在子包build.js中配置{stdio:'inherit'}

//3.创建一个映射表
const name = path.basename(packageDir)
// console.log('name',name)
// 与packjson中的buildOptions相对应
const outOptions = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: 'es'// 处理es
  },
  'cjs': {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs'// 处理commonjs
  },
  'global': {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife'// 立即执行函数
  }
}

//4.rollup需要导出一个配置
function createConfig(format, output){
    // 进行打包
    output.name = packageOptions.name
    output.sourcemap = true//用于调试代码的---》对应需要修改tsconfig.json配置项
    // 生成rollup的配置
    return {
      input: resolve('src/index.ts'), // 导入
      output, // 导出
      plugins: [
        // 插件
        json(),
        ts({
          // 解析ts
          tsconfig: path.resolve(__dirname, 'tsconfig.json')
        }),
        resolvePlugin() //解析第三方插件
      ]
    }

}
// const ress = packageOptions.formats.map((format) => createConfig(format,outOptions[format]))
// console.log('ress',ress)
// 注意报错:Command failed with exit code 1: rollup -c --environment TARGET:reactivity   Error: failed to open 'undefined'
// 解决:plugins配置错误
export default packageOptions.formats.map((format) =>
  createConfig(format, outOptions[format])
)
