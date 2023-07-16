import { hasChange } from '@vue/share';
import {track, trigger} from './effect'
import { TriggerOpTypes, TrackOpTypes } from './operations'
export function ref(target){
    return createRef(target)
}
export function shallowRef(target){
    return createRef(target,true)
}
class RefImpl {
    public __v_isRef = true;//赋值
    public _value;//声明
    constructor(public rawValue, public shallow) { // public 相当于this.rawValue = rawValue
        // this.rawValue = rawValue // ts中的写法为 public rawValue
        this._value = rawValue;// 用户传入的值 原来的值
    }
    // 类的属性访问器:获取value值      问题:实现响应式  收集依赖Track,触发更新Trigger
    get value(){ // 获取 name.value
        track(this, TrackOpTypes.GET,'value')// 收集依赖
        return this._value
    }
    // 设置value值
    set value(newValue){  // 修改 name.value = 'ls'
        if(hasChange(this._value,newValue)){
            this._value = newValue  // 若新旧值不一样,需要将新值赋值给旧值
            this.rawValue = newValue
            trigger(this, TriggerOpTypes.SET,'value',newValue)// 触发更新
        }
    }
}
function createRef(rawValue, shallow = false){ // 浅代理
    // 创建ref 实例对象
    return new RefImpl(rawValue, shallow)
}