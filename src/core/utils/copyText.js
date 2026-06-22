/*
 * @desc 复制文本
 * @param {string} text 复制内容
 * @param {function} success 成功回调
 */
function copyText(text, success) {
    // 数字没有 .length 不能执行selectText 需要转化成字符串
    const textString = text.toString()
    let input = document.querySelector('#copy-input')
    if (!input) {
        input = document.createElement('input')
        input.id = 'copy-input'
        input.readOnly = 'readOnly'        // 防止ios聚焦触发键盘事件
        input.style.position = 'fixed'
        input.style.left = '-1000px'
        input.style.zIndex = '-1000'
        document.body.appendChild(input)
    }
    input.value = textString
    // ios必须先选中文字且不支持 input.select();
    selectText(input, 0, textString.length)
    if (document.execCommand('copy')) {
        document.execCommand('copy')
        if (success) {
            success(textString)
        } else {
            alert('已复制到粘贴板')
        }

    } else {
        console.log('不兼容')
    }
    input.blur()
    // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
    // 选择文本。createTextRange(setSelectionRange)是input方法
    function selectText(textbox, startIndex, stopIndex) {
        if (textbox.createTextRange) {// ie
            const range = textbox.createTextRange()
            range.collapse(true)
            range.moveStart('character', startIndex)// 起始光标
            range.moveEnd('character', stopIndex - startIndex)// 结束光标
            range.select()// 不兼容苹果
        } else {// firefox/chrome
            textbox.setSelectionRange(startIndex, stopIndex)
            textbox.focus()
        }
    }
}

export default copyText
