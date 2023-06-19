/**
 * 类似utils,提供公共方法的文件
 */
import {b} from '@vue/reactivity'// 需要在tsconfig中配置路径引入问题
const a = 1
let test = 'juaita'
const str = 'deng'
export {a,test,str,b} 



function isObject(target){
    return typeof target === 'object' && typeof target !== null
}
export { isObject }