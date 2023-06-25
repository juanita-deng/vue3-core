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
function createReactEffect(fn,options){
    const effect = function reactiveEffect(){// 响应式的effect
        fn()// 执行用户传入的方法
    }
    activeEffect = effect;
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
export function track(target,type,key){
    console.log(activeEffect, target, type, key)
}
// 问题: 嵌套的effect非同一个effect
// effect(() => {//默认立即执行  
//     state.sex// effect1
//     effect(() => { // effect2  
//         state.age// effect2
//     })
//     console.log(400)
//     state.name// effect1
// })