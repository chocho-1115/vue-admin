// 函数防抖 多次触发只执行最后一次  此函数不执行第一次触发
function debounce (method, delay){
    let timeout
    return function () {
        let context = this // 保存this指向
        let args = arguments // 拿到event对象
        clearTimeout(timeout)
        timeout = setTimeout(function(){
            method.apply(context, args)
        }, delay)
    }
}

export default debounce
