const homePageRoutes = [
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
  }, {
    name: 'userCenter',
    path: '/usercenter',
    meta: {
      title: '个人信息',
      icon: 'icon-user',
      type: 'M',
      hidden: false,
    },
    component: () => import('@/views/userCenter/index.vue'),
  }, {
    name: 'message',
    path: '/message',
    meta: {
      title: '消息中心',
      icon: 'icon-message',
      type: 'M',
      hidden: false,
    },
    component: () => import('@/views/userCenter/message.vue'),
  }, {
    name: 'system',
    path: '/system',
    meta: {
      title: '系统配置',
      icon: 'icon-settings',
      type: 'M',
      hidden: false,
    },
    component: () => import('@/views/setting/config/index.vue'),
  }, {
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

export const homePage = {
  name: 'home',
  path: '/home',
  meta: { title: '首页', icon: 'icon-home', hidden: false, type: 'M' }
}

export default homePageRoutes