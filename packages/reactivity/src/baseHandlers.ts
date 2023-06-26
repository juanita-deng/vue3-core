import { isArray, isObject, isIntegerKey, hasOwn, hasChange  } from "@vue/share";
import { reactive, readonly } from './index'
import { TrackOpTypes, TriggerOpTypes } from './operations'
import { track, trigger } from './effect'
//柯里化函数
 function createGetter(isReadonly=false,shallow=false){
    // const state = reactive({name:'zs'})
    return function get(target,key,receiver){// value: target[key]  state.name则会触发get
        // proxy + refeclt
        const res = Reflect.get(target, key, receiver)// res👎属性值:即target[key]
        //不是只读的话,收集依赖
        if(!isReadonly){
            //收集依赖 effect(watcher),等数据变化后更新视图
            track(target, TrackOpTypes.GET,key)
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
 //柯里化函数
function createSetter(shallow=false){
    return function set(target,key,value,receiver){
        const res = Reflect.set(target,key,value,receiver)// 设置最新的值
        // 注意判断:1.target的内容是数组还是对象  2.是添加值还是修改值  proxy可以代理数组和对象
           // 1.获取老值
           const oldValue = target[key]
           // 2.判断内容 [1,2,3] ==》 ‘1’:1  ‘2’:2 ...  Number(key) < target.length true:说明是修改 false:说明是新增  hasOwn:如果是对象
        const hasKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length :hasOwn(target, key)
           // 2.1.没有key就是新增
           if(!hasKey){
             trigger(target,TriggerOpTypes.ADD,key,value)
           } else {
               //2.2.1修改的时候,新值和旧值一样(则不需要修改,性能优化)
               // 2.2.有key就是修改
               if(!hasChange(value,oldValue)){
                   trigger(target, TriggerOpTypes.SET, key, oldValue)
               }
           }
        // 触发更新进行设置
        return res;

    }
}
 //get相关
const get = createGetter();// 不是只读,且是深度响应
const shallowGet = createGetter(false,true)
const readonlyGet = createGetter(true,false)
const shallowReadonlyGet = createGetter(true,true)

//set相关
const set = createSetter();
const shallowSet = createSetter(true)
export const reactiveHandlers = {
    get,
    set
}
export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet
}
export const readonlyHandlers = {
    get: readonlyGet,
    set:(target,key) => {
        console.warn(`[Vue warn] Set operation on key '${String(key)}' failed: target is readonl`)
    }
}
// 仅对第一层进行只读
export const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set: (target, key) => {
        console.warn(`[Vue warn] Set operation on key '${String(key)}' failed: target is readonl`)
    }
}