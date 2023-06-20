import { isObject } from "@vue/share"// 定义的公共方法
import { reactiveHandlers, shallowReactiveHandlers, readonlyHandlers, shallowReadonlyHandlers }from './baseHandlers'

/**
 * 
 *  四个方法:1.是不是可读  2.是不是深度监听
 *     注意:核心:proxy  源码中 柯里化:根据不同的参数,proxy(target,handler)
 */
export function reactive(target){
    return createReactObj(target,false,reactiveHandlers)
}
export function shallowReactive(target){
    return createReactObj(target, false, shallowReactiveHandlers)
}
export function readonly(target) {
    return createReactObj(target, true, readonlyHandlers)
}
export function shallowReadonly(target) {
    return createReactObj(target, true, shallowReadonlyHandlers)

}

// 数据结构表:用于存放代理的数据
const reactiveMap = new WeakMap()//WeakMap:key 是一个对象,而且可以自动进行垃圾回收
const readonlyMap = new WeakMap();
// 高阶函数:参数是一个函数或者返回值是一个函数   ————》实现代理的核心
function createReactObj(target, isReadonly, baseHandlers) {//baseHandlers:处理拦截,get,set..处理各自的细节(拦截依赖..)
   const proxyMap = isReadonly ? readonlyMap:reactiveMap;
   if(!isObject(target)){
     return target// 若不是一个对象就直接原值返回
   }
   // 核心:proxy 
   // 优化:如果已经被代理过就不需要被再次代理,而是直接返回出去--》eg:  const obj = reactive({name:'zs'})   reactive(obj) ??
    const existingProxy = proxyMap.get(target);
   if (existingProxy) {// 已被代理过
     return existingProxy
   }
   const proxy = new Proxy(target,baseHandlers)
   proxyMap.set(target, proxy)// 在结构表中存放这个被代理过的数据
   return proxy;
}
