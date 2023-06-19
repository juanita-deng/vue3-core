import { isObject } from "@vue/share";
import { reactive, readonly } from './index'
//柯里化函数
 function createGetter(isReadonly=false,shallow=false){
    return function get(target,key,receiver){// value: target[key]
        // proxy + refeclt
        const res = Reflect.get(target, key, receiver)// res👎属性值:即target[key]
        //不是只读的话,收集依赖
        if(!isReadonly){
            //收集依赖
        }
    
        //若是浅层响应,直接返回结果(对应的value)  eg: state:{ list:{age:12},datas:'123'}
        if(shallow){
            return res // 只对state.list进行代理
        }
    
        //key是一个对象,需要递归实现深度响应
        //面试:懒代理操作实现了优化,即通过浅层次的代理实现性能的优化,如果是深层次的对象才会去递归遍历,而vue2中直接就递归遍历,不管嵌套的层级深浅
        if(isObject(res)){
            return isReadonly ? readonly(res) : reactive(res)// reactive递归(实现深度代理)
        }
        return res

    }
 }
const get = createGetter();// 不是只读,且是深度响应
const shallowGet = createGetter(false,true)
const readonlyGet = createGetter(true,false)
const shallowReadonlyGet = createGetter(true,true)
export const reactiveHandlers = {
    get
}
export const shallowReactiveHandlers = {
    get: shallowGet
}
export const readonlyHandlers = {
    get: readonlyGet
}
export const shallowReadonlyHandlers = {
    get: shallowReadonlyGet
}