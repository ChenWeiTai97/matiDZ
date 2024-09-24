const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    // assetsDir: 'static',
    parallel: false,
    // publicPath:  '/mativue/',
    transpileDependencies: true,
    lintOnSave: false,
    devServer: {                //记住，别写错了devServer//设置本地默认端口  选填
        proxy: {                 //设置代理，必须填
            '/api': {              //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
                target: 'http://192.168.120.20:8099/',     //代理的目标地址
                // http://33a42407e0.qicp.vip
                changeOrigin: true,              //是否设置同源，输入是的
                pathRewrite: {                   //路径重写
                    '^/api': ''                     //选择忽略拦截器里面的内容
                }
            },
            '/huiya': {              //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
                target: 'http://localhost:9876',     //代理的目标地址
                changeOrigin: true,              //是否设置同源，输入是的
                pathRewrite: {                   //路径重写
                    '^/api': ''                     //选择忽略拦截器里面的内容
                }
            }
        }
    }
})

