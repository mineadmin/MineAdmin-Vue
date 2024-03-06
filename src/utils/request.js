import axios from 'axios'
import {Message} from '@arco-design/web-vue'
import tool from '@/utils/tool'
import {get, isEmpty} from 'lodash'
import qs from 'qs'
import {h} from 'vue'
import {IconFaceFrownFill} from '@arco-design/web-vue/dist/arco-vue-icon'
import router from "@/router";

function createExternalService() {
  // 创建一个外部网络 axios 实例
  const service = axios.create()

  // HTTP request 拦截器
  service.interceptors.request.use(
    config => config,
    error => Promise.reject(error)
  );

  // HTTP response 拦截器
  service.interceptors.response.use(
    response => response,
    error => {
      Promise.reject(error.response ?? null)
    }
  )
  return service
}

function createService () {
  // 创建一个 axios 实例
  const service = axios.create()

  // HTTP request 拦截器
  service.interceptors.request.use(
    config => config,
    error => {
      console.log(error)
      // 失败
      return Promise.reject(error);
    }
  );

  // HTTP response 拦截器
  service.interceptors.response.use(
    response => {
      if ((response.headers['content-disposition'] || ! /^application\/json/.test(response.headers['content-type'])) && response.status === 200) {
        return response
      } else if (response.data.size) {
        response.data.code = 500
        response.data.message = '服务器内部错误'
        response.data.success = false
      } else if (response.data.code && response.data.code !== 200) {
        Message.error({
          content: response.data.message,
          icon: () => h( IconFaceFrownFill )
        })
      }
      return response.data;
    },
    error => {
      const err = (text) => {
        Message.error({
          content: ( error.response && error.response.data && error.response.data.message )
          ? error.response.data.message
          : text,
          icon: () => h( IconFaceFrownFill )
        })
      }
      if (error.response && error.response.data) {
        switch (error.response.status) {
          case 404:
            err('服务器资源不存在')
            break
          case 500:
            err('服务器内部错误')
            break
          case 401:
            throttle(() => {
              err('登录状态已过期，需要重新登录')
              tool.local.clear()
              router.push({name: 'login'})
            })()
            break
          case 403:
            err('没有权限访问该资源')
            break
          default:
            err('未知错误！')
        }
      } else {
        err('请求超时，服务器无响应！')
      }
      return Promise.reject(error.response && error.response.data ? error.response.data : null)
    }

  )
  return service
}

//节流
function throttle(fn, wait = 1500) {
  return function () {
    let context = this;
    if (!throttle.timer) {
      fn.apply(context, arguments);
      throttle.timer = setTimeout(function () {
        throttle.timer = null;
      }, wait)
    }
  }
}

function stringify (data) {
  return qs.stringify(data, { allowDots: true, encode: false })
}

/**
 * @description 创建请求方法
 * @param service
 * @param externalService
 */
 function createRequest (service, externalService) {
  return function (config) {
    const env = import.meta.env
    const token = tool.local.get(env.VITE_APP_TOKEN_PREFIX)
    const setting = tool.local.get('setting')
    const configDefault = {
      headers: Object.assign(
        {
          Authorization: "Bearer " + token,
          'Accept-Language': setting?.language || 'zh_CN',
          'Content-Type': get(config, 'headers.Content-Type', 'application/json;charset=UTF-8')
        },
        config.headers
      ),

      timeout: 10000,
      data: {}
    }

    delete config.headers
    // return
    const option = Object.assign(configDefault, config)

    // json
    if (!isEmpty(option.params)) {
      option.url = option.url + '?' + stringify(option.params)
      option.params = {}
    }

    if (! /^(http|https)/g.test(option.url) ) {
      option.baseURL = env.VITE_APP_OPEN_PROXY === 'true' ? env.VITE_APP_PROXY_PREFIX : env.VITE_APP_BASE_URL
      return service(option)
    } else {
      return externalService(option)
    }
  }
}

export const service = createService()
export const externalService = createExternalService()
export const request = createRequest(service, externalService)
