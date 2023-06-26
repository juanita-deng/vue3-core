// 1.定义effect,实现响应式数据
  //effect:收集依赖,更新视图
export function effect(fn, options: any = {}){
    // 判断若传人的参数不是懒加载,则默认立即执行
    const effect = createReactEffect(fn, options)
    if(!options.lazy){
        effect()
    }
    return effect
}
let activeEffect;// 保存当前的effect
let effectStack =[];// 定义一个栈结构
function createReactEffect(fn,options){
    const effect = function reactiveEffect(){// 响应式的effect
        if(!effectStack.includes(effect)){//保证effect没有加入过栈中
            try {
                //入栈
                effectStack.push(effect)
                activeEffect = effect;
                fn()// 执行用户传入的方法
            } finally {// 不管前面结果如何都会向下执行到这里
                //出栈
                effectStack.pop();
                activeEffect = effectStack[effectStack.length - 1]
            }

        }
    }
    // 定义响应effect的相关属性
    let uid
    // 区别effect
    effect.id = uid++
    effect._isEffect = true

    // 保存用户的方法
    effect.fn = fn
    // 保存用户的属性
    effect.options = options
    // 返回响应式的effect
    return effect
}

// 3.收集effect,在获取数据的时候触发get
const targetMap = new WeakMap();// 创建结构表
export function track(target,type,key){
    // console.log(activeEffect, target, type, key)
    // 没有在effect中使用   
    if(activeEffect === undefined) return
    // key和effect一一对应,即 key(target) ==> 属性[effect]
    // 有在effect中使用 获取effect: {target:值:(name)} --> {target:dep(map)}
    // 值中没有这个属性,则添加这个值
    let depMap =  targetMap.get(target)
    if(!depMap){
        // 值中有这个属性,则获取这个属性
        targetMap.set(target,(depMap = new Map));// 添加值
    }
    let dep = depMap.get(key)// { name:set[] } 监听key值有没有
    if(!dep){
        // 没有这个属性就添加属性 {name:set[]}
        depMap.set(key,(dep = new Set))
    }
    if(!dep.has(activeEffect)){
        dep.add(activeEffect)// 收集effect
    }
    // console.log('targetMap',targetMap)
}
export function trigger(target,type,key,newValue?,oldValue?){
    console.log('123?', target, type, key, newValue , oldValue)
    console.log('targetMap',targetMap)// 收集的依赖 map => {target:map{key => set}}
    // 获取收集的依赖对应的map
    const depMap = targetMap.get(target)// map
    // 没有就返回
    if(!depMap) return
    // 有就执行
    const effectSet = new Set()
      // 如果有多个同时修改一个值,并且相同,set可以过滤重复的值
    const add = (effectAdd) => {
        if(effectAdd){
            effectAdd.forEach((effect) => effectSet.add(effect) )
        }
    }
    add(depMap.get(key))// depMap.get(key) set[] 获取当前属性的effect
    // 执行
    effectSet.forEach((effect:any) => effect())

}
// 问题: 1.嵌套的effect非同一个effect(树形结构)
// effect(() => {//默认立即执行   入栈:[effect1,effect2] ------->出栈:[effect1]
//     state.sex// effect1
//     effect(() => { // effect2  
//         state.age// effect2
//     })
//     console.log(400)
//     state.name// effect1
//     state.a // 10 收集依赖effect1
//     state.a++ // 10 11 收集的依然是effect1
// })