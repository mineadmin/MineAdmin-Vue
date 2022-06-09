//系统路由
const routes = [
  {
    name: 'layout',
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: 'dashboard',
    children: [{
      name: 'home',
      path: '/home',
      component: () => import('@/layout/index.vue'),
      redirect: 'dashboard',
      meta: { title: '首页', icon: 'icon-home', hidden: false, type: 'M' },
      children: [
        {
          name: 'dashboard',
          path: '/dashboard',
          meta: {
            title: '仪表盘',
            icon: 'icon-dashboard',
            type: 'M',
            hidden: false,
            affix: true
          },
          component: () => import('@/views/dashboard/index.vue'),
        },{
          name: 'userCenter',
          path: '/usercenter',
          meta: {
            title: '个人信息',
            icon: 'icon-user',
            type: 'M',
            hidden: false,
          },
          component: () => import('@/views/userCenter/index.vue'),
        },{
          name: 'message',
          path: '/message',
          meta: {
            title: '消息中心',
            icon: 'icon-message',
            type: 'M',
            hidden: false,
          },
          component: () => import('@/views/userCenter/message.vue'),
        },{
          name: 'system',
          path: '/system',
          meta: {
            title: '系统配置',
            icon: 'icon-settings',
            type: 'M',
            hidden: false,
          },
          component: () => import('@/views/setting/index.vue'),
        },{
          name: 'demo',
          path: '/demo',
          meta: {
            title: '组件演示',
            icon: 'icon-trophy',
            type: 'M',
            hidden: false,
          },
          component: () => import('@/views/demo/index.vue'),
        }
      ]
    }]
  }, {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login.vue'),
    meta: { title: '登录' }
  }
  , {
    path: "/:pathMatch(.*)*",
    hidden: true,
    meta: { title: '访问的页面不存在' },
    component: () => import('@/layout/404.vue'),
  }
]

export default routes