import axios from "axios"
import router from "../router"
import { Message } from "element-ui"

export const baseurl = process.env.NODE_ENV === "production" ? "/suc-web/" : "43.142.36.176:1:8006"
export const socketBaseUrl = process.env.NODE_ENV === "production" ? "/" : "ws://43.142.36.176:9091"

axios.defaults.withCredentials = true
// 创建axios实例
const service = axios.create({
    xsrfHeaderName: "Authorization",
    baseURL: baseurl, // api的base_url
    timeout: 60000*4 // 请求超时时间
})
// let token  =  store.state.userInfo.token;
// request拦截器
service.interceptors.request.use(
    config => {
        let hasToken = window.sessionStorage.getItem("sucToken")
        // console.log("hasToken =>",hasToken);
        if(hasToken){
            config.headers["Authorization"] = hasToken;
        }
        return config
    },
    error => {
        alert(error)
        Promise.reject(error)
    }
)
// respone拦截器
service.interceptors.response.use(
    response => {
        // console.log(response)
        if(response.data.code === 10010){
            Message.error("登录过期，请重新登录")
            window.sessionStorage.removeItem("sucToken")
            window.sessionStorage.removeItem("userInfo")
            setTimeout(function () {
                router.push("/login")
                router.go(0)
            },2000)
        }
        return response.data
    },
    error => {
        console.log("err" + error) // for debug
        return Promise.reject(error)
    }
)

export default service
