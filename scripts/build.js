// 打包 通过monerope进行打包---》获取到需要打包的包

//1.获取打包目录
const fs = require('fs');
// import fs from 'fs'
   /**
    * execa是可以调用shell和本地外部程序的javascript封装。会启动子进程执行。支持多操作系统，包括windows。如果父进程退出，则生成的全部子进程都被杀死。
    */
const execa = require('execa')
// import execa from 'execa'
  // readdirSync: node中读取文件名称方法
const dirs = fs.readdirSync('packages').filter(p => {
  //  注意需要过滤掉packages下面不是文件夹的情况(即:仅针对文件夹进行打包)
  if(!fs.statSync(`packages/${p}`).isDirectory()){ // isDirectory:node中判断是否是文件夹
      return false
  }
  return true
})
async function build(target){
  // 注意:execa开启子进程,也是一个包,会返回一个promise
  // -c :使用配置文件 rollup.config.js 打包  -env:环境变量  stdio:inherit 子进程的输出在父进程中输出
  await execa('rollup', ['-c', '--environment', `TARGET:${target}`], {
    stdio: 'inherit'
  })
}
// 2.进行打包(并行打包)
async function runparalles(dirs,itemFn){
    // 2.1.遍历package下所有的包
    const result = []
    for(let item of dirs){
        result.push(itemFn(item))
    }
    // 2.2.存放打包的promise,等这里的打包执行完毕之后,调用成功
    return Promise.all(result)
}
runparalles(dirs,build).then(() => {
    console.log('所有打包成功')
})

console.log('fs',dirs)