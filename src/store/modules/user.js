import { defineStore } from 'pinia'
import loginApi from '@/api/login'
import tool from '@/utils/tool'
import router from '@/router'
import webRouter from '@/router/webRouter'
import { homePage } from '@/router/homePageRoutes'

const useUserStore = defineStore('user', {

  state: () => ({
    codes: undefined,
    roles: undefined,
    routers: undefined,
    user: undefined,
    menus: undefined,
  }),

  getters: {
    setUserInfo(state) {
      return { ...state };
    },
  },

  actions: {

    setToken(token) {
      tool.local.set(import.meta.env.VITE_APP_TOKEN_PREFIX, token)
    },

    getToken() {
      return tool.local.get(import.meta.env.VITE_APP_TOKEN_PREFIX)
    },

    clearToken() {
      tool.local.remove(import.meta.env.VITE_APP_TOKEN_PREFIX)
    },

    setInfo(data) {
      this.$patch(data)
    },

    resetUserInfo() {
      this.$reset();
    },

    setMenu(data) {
      const routers = flatAsyncRoutes(filterAsyncRouter(data))
      routers.map( item => router.addRoute('layout', item) )
    },

    requestUserInfo() {
      return new Promise((resolve, reject) => {
        loginApi.getInfo().then(async response => {
          await this.setInfo(response.data)
          this.routers = removeButtonMenu(this.routers)
          this.setMenu(this.routers)
          homePage.children = webRouter[0].children
          if (! this.codes.includes('setting:config')) 
            // todo...
          }
          this.routers.unshift(homePage)
          resolve(response.data)
        }).catch(error => {
          this.clearToken()
          reject(error)
        })
      }).catch(error => {
        this.clearToken()
        reject(error)
      })
      
    },

    login(form) {
      return loginApi.login(form).then(r => {
        if (r.success) {
          this.setToken(r.data.token)
          return true
        } else {
          return false
        }
      }).catch(e => {
        console.error(e)
        return false
      })
    },

    async logout() {
      await loginApi.logout()
      this.clearToken()
      this.resetUserInfo()
    }
  }

})

//路由扁平化
const flatAsyncRoutes = (routes, breadcrumb=[]) => {
  let res = []
  routes.forEach(route => {
    const tmp = {...route}
    if (tmp.children) {
      let childrenBreadcrumb = [...breadcrumb]
      childrenBreadcrumb.push(route)
      let tmpRoute = { ...route }
      tmpRoute.meta.breadcrumb = childrenBreadcrumb
      delete tmpRoute.children
      res.push(tmpRoute)
      let childrenRoutes = flatAsyncRoutes(tmp.children, childrenBreadcrumb)
      childrenRoutes.map(item => {
        res.push(item)
      })
    } else {
      let tmpBreadcrumb = [...breadcrumb]
      tmpBreadcrumb.push(tmp)
      tmp.meta.breadcrumb = tmpBreadcrumb
      res.push(tmp)
    }
  })
  return res
}

const views = import.meta.glob('../../views/**/**.vue')

// 菜单转换路由
const filterAsyncRouter = (routerMap) => {
  const accessedRouters = []
  routerMap.forEach(item => {
    if (item.meta.type !== 'B') {

      if(item.meta.type === 'I'){
        item.meta.url = item.path
        item.path = `iframe/${item.name}`
      }

      const route = {
        path: item.path,
        name: item.name,
        hidden: item.hidden == 1,
        meta: item.meta,
        children: item.children ? filterAsyncRouter(item.children) : null,
        component: views[`../../views/${item.component}.vue`]
      }
      accessedRouters.push(route)
    }
  })
  return accessedRouters
}

// 去除按钮菜单
const removeButtonMenu = (routers) => {
  let handlerAfterRouters = []
  routers.forEach(item => {
    if (item.meta.type !== 'B' && ! item.meta.hidden) {
      let route = item
      if (item.children && item.children.length > 0) {
        route.children = removeButtonMenu(item.children)
      }
      handlerAfterRouters.push(route)
    }
  })
  return handlerAfterRouters
}
export default useUserStore