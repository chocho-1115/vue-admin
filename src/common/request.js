import axios from 'axios'
import { EventBus } from '@/core/eventBus'
import { initHttpSubscriber } from '@/common/httpSubscriber.js'

initHttpSubscriber()

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
})

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
service.interceptors.response.use(
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  (response) => {
    const res = response.data
    const url = response.config.url
    // if the custom code is not 0, it is judged as an error.
    if (res.code !== 0) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008) {
        EventBus.emit('auth:unauthorized', { url, res })
      } else if (res.code === 50012 || res.code === 50014) {
        EventBus.emit('auth:expired', { url, res })
      } else {
        EventBus.emit('request:error', { url, res })
      }
      console.log(response)
      const error = new Error(res.msg || res.data?.message || 'Error', { cause: response })
      error.response = response
      return Promise.reject(error) // 没有catch时 会直接抛出错误 不会执行请求之后的代码
    } else {
      return res
    }
  },
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.log("Error", error.message);
    }
    // console.log(error.config);

    const code = error.code // 自定义内容
    const message = error.message // 自定义内容
    const status = error.status // 请求状态码
    const url = error.config?.url // 请求url

    // 对响应错误做点什么
    EventBus.emit('request:error', { code, message, status, url })

    return Promise.reject(error)
  },
)

export default service
