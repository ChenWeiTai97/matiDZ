import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import dayjs from "dayjs"
import App from './App.vue';
import router from '../src/router';



Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$dayjs = dayjs;





//过滤器
Vue.filter('capitalize', function (money) {
  // va// 汉字的数字
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖',]
  // 基本单位
  const cnIntRadice = ['', '拾', '佰', '仟']
  // 对应整数部分扩展单位
  const cnIntUnits = ['', '万', '亿', '兆']
  // 对应小数部分单位
  const cnDecUnits = ['角', '分']
  // 整数金额时后面跟的字符
  const cnInteger = '整'
  // 整型完以后的单位
  const cnIntLast = '圆'
  // 最大处理的数字
  const maxNum = 9999999999999999.99
  // 金额整数部分
  let integerNum
  // 金额小数部分
  let decimalNum
  // 输出的中文金额字符串
  let chineseStr = ''
  // 分离金额后用的数组，预定义
  let parts
  if (money === '') {
    return ''
  }
  money = parseFloat(money)
  if (money >= maxNum) {
    // 超出最大处理数字
    return ''
  }

  //值为0 赋值为 空字符
  if (money === 0) {
    return '';
  }

  // 转换为字符串
  money = money.toString()
  //负数 最前方加入 负
  if (money.indexOf('-') === 0) {
    chineseStr += '负'
    money = money.substr(1)
  }
  if (money.indexOf('.') === -1) {
    integerNum = money

    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0
    const IntLen = integerNum.length
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1)
      const p = IntLen - i - 1
      const q = p / 4
      const m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        // 归零
        zeroCount = 0
        //alert(cnNums[parseInt(n)])
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  //小数部分
  if (decimalNum !== '') {
    const decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }

  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  }
  return chineseStr
})

Vue.filter('timeFormat', function (data, format) {
  let Y = data.getFullYear();
  let M = (data.getMonth() + 1).toString().padStart(2, 0);
  let D = (data.getDate()).toString().padStart(2, 0);
  let h = (data.getHours()).toString().padStart(2, 0);
  let m = (data.getMinutes()).toString().padStart(2, 0);
  let s = (data.getSeconds()).toString().padStart(2, 0);
  return format.replace("YYYY", Y).replace("MM", M).replace("DD", D).replace("hh", h).replace("mm", m).replace("ss", s);
})

Vue.filter('dateFormat', function (originVal) {
  if (originVal) {


    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    // const hh = (dt.getHours() + '').padStart(2, '0')
    // const mm = (dt.getMinutes() + '').padStart(2, '0')
    // const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d}`
  }
  // return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


// new Vue({
//   render: h => h(App),
// }).$mount('#app')

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')