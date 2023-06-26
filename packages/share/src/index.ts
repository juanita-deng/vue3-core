/**
 * 类似utils,提供公共方法的文件
 */
import {b} from '@vue/reactivity'// 需要在tsconfig中配置路径引入问题
const a = 1
let test = 'juaita'
const str = 'deng'
export {a,test,str,b} 


// 是否是对象
export const isObject = (target) => typeof target === 'object' && typeof target !== null

// 是否是数组
export const isArray = Array.isArray

// 是否是数字
export const isNumber = (target) => typeof target === 'number'

// 是否是字符串
export const isString = (target) => typeof target === 'string'

// 判断数组的key是否是整数
export const isIntegerKey =(target) => parseInt(target,10) + '' === target 

// 判断对象中是否有这个属性
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val,key) => hasOwnProperty.call(val, key)

// 判断新旧值是否一致
export const hasChange = (val,oldValue) => val !== oldValue;