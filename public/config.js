/** 控制打包时，参数的配置
 * 解决服务器部署，api不变的问题
 *  baseURL: "http://192.168.6.6:19999",
 *  baseURL: process.env.VUE_APP_BASE_API
 * */ 
exports.PLATFROM_CONFIG = {
    //API调用的服务地址
     baseURL: 'http://192.168.6.6:19999'
    // baseURL: 'http://localhost:19999'
  }
  