import axios from 'axios'

// const request = axios.create({
//     baseURL: '/api',  // 注意！！ 这里是全局统一加上了 '/api' 前缀，也就是说所有接口都会加上'/api'前缀在，页面里面写接口的时候就不要加 '/api'了，否则会出现2个'/api'，类似 '/api/api/user'这样的报错，切记！！！
//     timeout: 5000
// })

const instance = axios.create({
    //本地json
    //   baseURL: process.env.VUE_APP_BASE_API,
      baseURL: 'api',
      headers:{
        "Content-Type":"application/json;charset=UTF-8"
      },
    //开发环境跨域-npm run dev ,需要在vue.config.js里配置代理跨域proxy
    //       baseURL:"/api",
    //线上环境跨域-npm run build。可用第三方代理或者让后台给你开跨域
      // baseURL:"https://bird.ioliu.cn/v1?url=http://ustbhuangyi.com/",
      timeout: 5000,
      //可统一配置其它属性
      // responseType: "json",
      // withCredentials: true, // 是否允许带cookie这些
      // headers: {
      //     "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      // },
    });
 
// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
  
 // config.headers['token'] = user.token;  // 设置请求头
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default instance