/*
 * @desc 在Min至Max区间内获取随机数字
 * @param {number} Min 最小值 integerB如果为true 将包含Min本身，否则不包含Min
 * @param {number} Max 最大值 integerB如果为true 将包含Max本身，否则不包含Max
 * @param {boolean} integerB 是否为整数
 */
function getRandomNum(Min, Max, integerB) {
  if (integerB) {
    return Math.floor(Math.random() * (Max - Min + 1) + Min)
  } else {
    return Min + Math.random() * (Max - Min)
  }
}

export default getRandomNum
