# MineAdmin-Vue 介绍

> **版本**: 3.0.0
> **更新日期**: 2026-06-02
> **Node.js 要求**: ^20.0.0 || >=21.1.0
> **GitHub**: https://github.com/mineadmin

---

## 目录

- [一、项目概览](#一项目概览)
- [二、技术栈](#二技术栈)
- [三、项目目录结构](#三项目目录结构)
- [四、构建配置详解](#四构建配置详解)
- [五、环境变量配置](#五环境变量配置)
- [六、核心功能模块](#六核心功能模块)
- [七、关键机制实现](#七关键机制实现)
- [八、业务模块说明](#八业务模块说明)
- [九、项目特色与亮点](#九项目特色与亮点)
- [十、开发指南](#十开发指南)

---

## 一、项目概览

MineAdmin-Vue 是一个**架构设计精良、工程化程度极高**的企业级中后台管理系统前端项目，采用了当前 Vue3 生态的最佳实践组合，具有高度的可扩展性和可维护性。

### 核心特性

- ✅ **模块化架构** - 按功能组织代码，支持插件热插拔
- ✅ **Provider DI 模式** - 借鉴 Laravel 的服务提供者思想
- ✅ **四级权限体系** - 路由级 / 指令级 / 函数级，支持 auth/role/user 三维度
- ✅ **三套布局方案** - classic/columns/mixed 自由切换
- ✅ **动态路由系统** - 后端返回菜单 → 前端动态注册
- ✅ **Token 无感刷新** - 401 自动 refresh_token 刷新，并发请求排队
- ✅ **完整的暗色模式** - light/dark/autoMode 三种模式
- ✅ **国际化支持** - zh_CN/zh_TW/en 三语 YAML 语言包
- ✅ **原子化 CSS** - UnoCSS 替代 TailwindCSS
- ✅ **移动端适配** - 响应式断点 + 触控优化

---

## 二、技术栈

### 2.1 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **Vue** | ^3.5.32 | 前端核心框架（Composition API） |
| **Vite** | ^8.0.7 | 新一代前端构建工具 |
| **TypeScript** | ^5.9.3 | 类型安全的 JavaScript 超集 |
| **Vue Router** | ^4.6.4 | 官方路由管理（Hash/History 模式） |
| **Pinia** | ^3.0.4 | 官方状态管理库 |

### 2.2 UI 组件体系

| 库名 | 版本 | 说明 |
|------|------|------|
| **Element Plus** | ^2.13.6 | 主 UI 组件库（含暗色模式 CSS 变量） |
| **@mineadmin/table** | ^1.0.51 | 封装的表格组件 |
| **@mineadmin/form** | ^1.0.57 | 封装的表单组件 |
| **@mineadmin/search** | ^1.0.59 | 封装的搜索组件 |
| **@mineadmin/pro-table** | ^1.0.91 | 高级专业表格组件 |
| **@mineadmin/echarts** | ^1.0.7 | 封装的 ECharts 图表组件 |
| **radix-vue** | ^1.9.17 | 无样式可访问性原语组件 |
| **vaul-vue** | ^0.3.0 | 抽屉(Drawer)动画组件 |

### 2.3 HTTP 与网络

| 库 | 版本 | 用途 |
|----|------|------|
| **axios** | ^1.15.0 | HTTP 客户端（拦截器/TOKEN刷新/Blob处理） |
| **qs** | ^6.15.1 | URL 参数序列化 |

### 2.4 工具函数库

| 库 | 版本 | 用途 |
|----|------|------|
| **@vueuse/core** | ^12.8.2 | Vue 组合式工具集 |
| **lodash-es** | ^4.18.1 | 函数式编程工具集 |
| **radash** | ^12.1.1 | 现代化工具函数库 |
| **dayjs** | ^1.11.20 | 轻量日期处理库 |

### 2.5 国际化与样式

| 库 | 版本 | 用途 |
|----|------|------|
| **vue-i18n** | 11.1.2 | 国际化方案（Composition API 模式） |
| **UnoCSS** | ^66.6.8 | 原子化 CSS 引擎 |
| **Sass** | ^1.99.0 | CSS 预处理器 |
| **animate.css** | ^4.1.1 | CSS 动画库 |

### 2.6 其他重要依赖

| 库 | 用途 |
|----|------|
| **echarts** | 数据可视化图表 |
| **nprogress** | 页面加载进度条 |
| **overlayscrollbars** | 自定义滚动条 |
| **sortablejs** | 拖拽排序 |
| **md-editor-v3** | Markdown 编辑器 |
| **@iconify/vue** | 图标系统 |

---

## 三、项目目录结构

```
d:/other/MineAdmin-Vue/
├── .env.development           # 开发环境变量
├── .env.production            # 生产环境变量
├── Dockerfile                 # Docker 容器化部署
├── eslint.config.js           # ESLint 配置
├── index.html                 # 入口 HTML（含加载动画）
├── package.json               # 项目依赖与脚本
├── playwright.config.ts       # E2E 测试配置
├── postcss.config.js          # PostCSS 配置
├── tsconfig.json              # TypeScript 主配置
├── tsconfig.node.json         # Node 端 TypeScript 配置
├── uno.config.ts              # UnoCSS 原子化 CSS 引擎配置
├── vite.config.ts             # Vite 构建工具主配置
│
├── vite/                      # Vite 插件集合目录
│   ├── index.ts               # 插件注册入口
│   ├── auto-import.ts         # 自动导入插件配置
│   ├── archiver.ts            # 打包归档插件
│   ├── chunk.ts               # 代码分块策略
│   ├── components.ts          # 组件自动注册
│   ├── compression.ts         # Gzip/Brotli 压缩
│   ├── devtools.ts            # Vue DevTools 集成
│   ├── i18n-message.ts        # i18n 消息提取
│   ├── optimize.ts            # 依赖预构建优化列表
│   ├── start-info.ts          # 启动信息展示
│   ├── svg-icon.ts            # SVG 图标处理
│   └── unocss.ts              # UnoCSS 插件
│
├── public/                    # 静态资源目录
│
├── src/                       # 源代码根目录
│   ├── main.ts                # 应用入口：创建 App 并执行 bootstrap
│   ├── bootstrap.ts           # 引导程序：初始化所有服务和中间件
│   ├── App.vue                # 根组件
│   │
│   ├── assets/                # 静态资源
│   │   ├── icons/             # SVG 图标源文件
│   │   ├── images/            # 图片资源
│   │   └── styles/            # 全局样式
│   │       ├── globals.scss   # 全局基础样式
│   │       ├── resources/     # SCSS 资源（变量/工具类/Element定制）
│   │       └── nprogress.scss # 进度条样式
│   │
│   ├── components/            # 业务通用组件（ma- 前缀命名）
│   │   ├── ma-auth/           # 权限验证包装组件
│   │   ├── ma-city-select/    # 城市选择器
│   │   ├── ma-col-card/       # 列卡片
│   │   ├── ma-dialog/         # 对话框封装
│   │   ├── ma-drawer/         # 抽屉封装
│   │   ├── ma-dict-picker/    # 字典选择器
│   │   ├── ma-form-open/      # 表单弹窗
│   │   ├── ma-icon-picker/    # 图标选择器
│   │   ├── ma-key-value/      # 键值对编辑
│   │   ├── ma-remote-select/  # 远程搜索下拉
│   │   ├── ma-resource-picker/# 资源选择器
│   │   ├── ma-select-table/   # 选择表格
│   │   ├── ma-svg-icon/       # SVG 图标组件
│   │   ├── ma-tree/           # 树形控件
│   │   ├── ma-upload-file/    # 文件上传
│   │   ├── ma-upload-image/   # 图片上传
│   │   └── ma-verify-code/    # 验证码
│   │
│   ├── directives/            # 自定义指令
│   │   ├── copy/              # v-copy 点击复制
│   │   └── permission/        # 权限指令组
│   │       ├── auth/          # v-auth 权限验证
│   │       ├── role/          # v-role 角色验证
│   │       └── user/          # v-user 用户验证
│   │
│   ├── hooks/                 # 组合式函数（Composables）
│   │   ├── useCache.ts        # 本地缓存封装
│   │   ├── useDialog.ts       # 对话框 hook
│   │   ├── useDrawer.ts       # 抽屉 hook
│   │   ├── useEcharts.ts      # ECharts hook
│   │   ├── useForm.ts         # 表单 hook
│   │   ├── useImageViewer.ts  # 图片查看器 hook
│   │   ├── useMessage.ts      # 消息通知 hook
│   │   ├── useTable.ts        # 表格 hook
│   │   ├── useThemeColor.ts   # 主题色 hook
│   │   ├── useWatermark.ts    # 水印 hook
│   │   └── ...               # 更多 hooks
│   │
│   ├── iconify/               # Iconify 离线图标管理
│   │   ├── data.json          # 图标数据
│   │   ├── index.json         # 图标集合索引
│   │   └── index.ts           # 离线图标下载安装逻辑
│   │
│   ├── layouts/               # 布局系统（使用 TSX 编写）
│   │   ├── index.tsx          # 【核心布局容器】Header+Aside+Main+Footer
│   │   ├── provider.tsx       # Provider 注入层
│   │   ├── uc.tsx             # 用户中心独立布局
│   │   ├── [...all].tsx       # 404 通配路由布局
│   │   └── components/        # 布局子组件
│   │       ├── header/        # 顶部导航栏
│   │       ├── main-aside/    # 主侧边栏（一级菜单）
│   │       ├── sub-aside/     # 子侧边栏（二级菜单）
│   │       ├── bars/          # 标签页栏 + 工具栏
│   │       ├── footer/        # 页脚版权信息
│   │       ├── back-top/      # 回到顶部
│   │       ├── iframe/        # iframe 内嵌页面容器
│   │       ├── search-panel/  # 全局搜索面板
│   │       ├── menu/          # 菜单组件
│   │       └── logo/          # Logo 组件
│   │
│   ├── locales/               # 国际化语言包
│   │   ├── zh_CN[简体中文].yaml
│   │   ├── zh_TW[繁體中文].yaml
│   │   └── en[English].yaml
│   │
│   ├── modules/               # 【业务模块】功能模块化目录
│   │   └── base/              # 基础内置模块
│   │       ├── api/           # API 接口定义
│   │       ├── views/         # 页面视图
│   │       └── locales/       # 模块级 i18n 语言包
│   │
│   ├── plugins/               # 项目级插件存放
│   │
│   ├── provider/              # 【服务提供者】依赖注入系统
│   │   ├── settings/index.ts  # ⭐ 系统默认设置 Provider
│   │   ├── mine-core/index.ts # ⭐ 核心组件 Provider
│   │   ├── plugins/index.ts   # ⭐ 插件系统 Provider
│   │   ├── dictionary/index.ts# 字典数据 Provider
│   │   └── echarts/index.ts   # ECharts 主题 Provider
│   │
│   ├── router/                # 路由系统
│   │   ├── index.ts           # ⭐ 路由实例 + 导航守卫
│   │   └── static-routes/     # 静态路由定义
│   │       ├── rootRoute.ts
│   │       ├── dashboardRoute.ts
│   │       ├── welcomeRoute.ts
│   │       └── ucChildren/
│   │
│   ├── store/                 # Pinia 状态管理
│   │   ├── index.ts           # Pinia 实例创建
│   │   └── modules/           # Store 模块
│   │       ├── useUserStore.ts        # 用户状态
│   │       ├── useMenuStore.ts        # 菜单状态
│   │       ├── useSettingStore.ts     # 系统设置
│   │       ├── useRouteStore.ts       # 路由状态
│   │       ├── usePluginStore.ts      # 插件状态
│   │       ├── useTabStore.ts         # 标签页状态
│   │       ├── useKeepAliveStore.ts   # KeepAlive 缓存
│   │       ├── useIframeKeepAliveStore.ts # iframe 缓存
│   │       ├── useDictStore.ts        # 字典数据
│   │       └── useResourceStore.ts    # 资源数据
│   │
│   └── utils/                 # 工具函数库
│       ├── http.ts            # ⭐ HTTP 封装（Axios 实例）
│       ├── ResultCode.ts      # 响应状态码枚举
│       ├── permission/        # 权限判断工具
│       │   ├── hasAuth.ts
│       │   ├── hasRole.ts
│       │   └── hasUser.ts
│       ├── download.ts        # 文件下载工具
│       ├── copyright.ts       # 版权信息工具
│       └── ...
│
├── types/                     # 全局 TypeScript 类型声明
│   ├── global.d.ts            # 全局类型定义（核心！）
│   ├── components.d.ts        # 组件自动注册类型
│   └── shims.d.ts            # 环境兼容声明
│
└── tests/                     # 测试文件
```

---

## 四、构建配置详解

### 4.1 Vite 核心配置 (`vite.config.ts`)

#### 路径别名映射

| 别名 | 映射路径 | 用途 |
|------|----------|------|
| `@` | `src/` | 源码根目录 |
| `#` | `types/` | 类型声明目录 |
| `$` | `src/plugins/` | 插件目录 |
| `~` | `src/modules/` | 模块目录 |

#### 开发服务器配置

```typescript
{
  port: 2888,              // 默认端口
  open: true,              // 自动打开浏览器
  proxy: {
    '/dev': {              // 开发代理前缀
      target: 'http://127.0.0.1:9501',
      changeOrigin: true
    },
    '/prod': {             // 生产代理前缀
      target: 'http://hyperf:9501',
      changeOrigin: true
    }
  }
}
```

#### 构建优化策略

- 生产环境移除 `console` 和 `debugger`
- 使用 `esbuild` 压缩 JS 和 CSS
- ECharts 单独分包（`manualChunks.echarts`）
- 输出带 hash 的静态资源到 `static/` 目录
- 支持 sourcemap 生成
- Sass 启用现代编译器 API（`modern-compiler`）

### 4.2 Vite 插件架构 (`vite/index.ts`)

按顺序加载的插件链：

| 序号 | 插件 | 功能 |
|------|------|------|
| 1 | @vitejs/plugin-vue | Vue SFC 支持 |
| 2 | @vitejs/plugin-vue-jsx | JSX/TSX 支持（布局组件大量使用 TSX） |
| 3 | start-info | 启动信息面板 |
| 4 | @vitejs/plugin-legacy | 旧浏览器兼容 |
| 5 | vite-plugin-vue-devtools | Vue DevTools 开发调试 |
| 6 | unplugin-auto-import | 自动导入 Vue/VueRouter/Pinia API |
| 7 | unplugin-vue-components | Element Plus 组件按需自动注册 |
| 8 | unocss/vite | UnoCSS 原子化 CSS |
| 9 | vite-plugin-svg-icons | SVG 图标精灵图 |
| 10 | vite-plugin-compression2 | Gzip/Brotli 产物压缩 |
| 11 | 自定义 archiver | 打包后生成 zip/tar 归档 |
| 12 | @intlify/unplugin-vue-i18n | i18n 消息提取优化 |
| 13 | vite-plugin-chunk-split | 代码分割策略 |

### 4.3 TypeScript 配置 (`tsconfig.json`)

- **目标**: ESNext
- **模块系统**: ESNext (Bundler 解析模式)
- **严格模式开启**，但 `noImplicitAny: false`
- 路径别名与 Vite 保持一致
- 允许 `.ts` 扩展名导入和 JS 文件混入

### 4.4 UnoCSS 配置 (`uno.config.ts`)

#### 预设 (Presets)

- `presetUno()` - Tailwind 兼容的原子类
- `presetAttributify()` - 属性化模式（如 `<div flex="center">`）
- `presetIcons()` - Iconify 图标
- `presetTypography()` - 排版样式

#### 转换器 (Transformers)

- `transformerDirectives()` - 指令模式（如 `@apply`）
- `transformerVariantGroup()` - 变体分组（如 `hover:(bg-red text-white)`）

#### 自定义快捷方式

```typescript
shortcuts: {
  'flex-center': 'flex justify-center items-center',
  'flex-col-center': 'flex flex-col justify-center items-center'
}
```

---

## 五、环境变量配置

### 5.1 开发环境 (`.env.development`)

```env
VITE_APP_TITLE=MineAdmin           # 应用标题
VITE_APP_PORT=2888                 # 开发端口
VITE_APP_ROOT_BASE=/               # 应用根路径
VITE_APP_API_BASEURL=http://127.0.0.1:9501  # 后端API地址
VITE_APP_ROUTE_MODE=hash           # 路由模式(hash/history)
VITE_APP_STORAGE_PREFIX=mine_      # 本地存储键前缀
VITE_OPEN_PROXY=true               # 是否启用代理
VITE_PROXY_PREFIX=/dev             # 代理前缀标识
VITE_OPEN_DEVTOOLS=false           # 是否开启开发者工具
```

### 5.2 生产环境 (`.env.production`)

- API 地址指向 Docker 服务名: `http://hyperf:9501`
- 代理前缀: `/prod`
- 支持生成 sourcemap
- 支持 gzip 和 brotli 双压缩
- 支持打包后生成 zip/tar 归档

---

## 六、核心功能模块

### 6.1 应用启动流程

```
createApp(App)
    ↓
bootstrap(app)
    ├─ 1. initProvider(app)          // 初始化服务提供者
    │   ├─ settings Provider         // → 注入 defaultSetting
    │   ├─ dictionary Provider       // → 注入 $dictionary
    │   ├─ echarts Provider          // → 注入 echarts 主题
    │   ├─ mine-core Provider        // → 注册 MaTable/Form/Search/ProTable
    │   └─ plugins Provider          // → 扫描并挂载 $plugins/$pluginsConfig
    ├─ 2. app.use(pinia)             // 安装 Pinia
    ├─ 3. app.use(router)            // 安装路由
    ├─ 4. app.use(ElementPlus)       // 安装 Element Plus
    ├─ 5. registerDirectives(app)    // 注册自定义指令
    ├─ 6. otherWorker(app)           // 其他初始化工作
    ├─ 7. createI18nService(app)     // 初始化国际化
    └─ 8. registerPlugin(app)        // 注册并启动插件
    ↓
router.isReady() → app.mount('#app')
```

### 6.2 Store 状态管理模块

| Store | 文件 | 职责 |
|-------|------|------|
| **useUserStore** | `store/modules/useUserStore.ts` | 用户登录/登出/Token/权限/角色/菜单/i18n |
| **useMenuStore** | `store/modules/useMenuStore.ts` | 顶菜单/子菜单/激活状态/布局联动 |
| **useSettingStore** | `store/modules/useSettingStore.ts` | 系统设置（布局/主题/水印/暗色模式/移动端适配） |
| **useRouteStore** | `store/modules/useRouteStore.ts` | 动态路由注册/菜单转路由/扁平化/插件路由合并 |
| **usePluginStore** | `store/modules/usePluginStore.ts` | 插件注册/启用/禁用/Hook 调度 |
| **useTabStore** | `store/modules/useTabStore.ts` | 标签页管理/最大化/收藏 |
| **useKeepAliveStore** | `store/modules/useKeepAliveStore.ts` | KeepAlive 缓存管理 |
| **useIframeKeepAliveStore** | `store/modules/useIframeKeepAliveStore.ts` | iframe 页面缓存 |
| **useDictStore** | `store/modules/useDictStore.ts` | 字典数据存储 |
| **useResourceStore** | `store/modules/useResourceStore.ts` | 资源数据存储 |

### 6.3 Provider 服务提供者

借鉴 Laravel 的 ServiceProvider 思想，实现依赖注入：

```typescript
interface Provider {
  name: string           // 提供者名称
  init?(): any | void    // 初始化（在 setProvider 之前执行）
  setProvider(app): void // 向 App 注入服务
  getProvider(): T       // 获取注入的服务
}
```

四个核心 Provider：

| Provider | 文件 | 功能 |
|----------|------|------|
| **settings** | `provider/settings/index.ts` | 系统全局配置（布局/主题/水印/版权等），深度合并默认配置 |
| **mine-core** | `provider/mine-core/index.ts` | 核心业务组件注册（MaTable/MaForm/MaSearch/MaProTable） |
| **plugins** | `provider/plugins/index.ts` | 插件系统初始化 |
| **dictionary** | `provider/dictionary/index.ts` | 数据字典 |

### 6.4 HTTP 请求封装 (`utils/http.ts`)

完整的 Axios 封装，特性包括：

#### 请求拦截器

- 自动附加 `Authorization: Bearer <token>` 头
- 自动附加 `Accept-Language` 语言头
- 触发插件 `networkRequest` Hook
- 显示 NProgress 进度条

#### 响应拦截器

- Blob/ArrayBuffer 类型处理（文件下载，自动解析文件名）
- 成功响应(code=200)直接返回 `data`
- **Token 过期自动刷新**:
  - 401 时尝试用 refresh_token 获取新 access_token
  - 刷新成功后重放失败的请求
  - 多个并发失败请求排队等待刷新完成
  - 刷新失败则强制登出
- 触发插件 `networkResponse` Hook

---

## 七、关键机制实现

### 7.1 权限管理系统（三级校验）

本项目实现了**三层独立的权限控制机制**：

#### (1) 路由级守卫 (`router/index.ts` - `afterEach`)

```typescript
// auth 权限码验证 - 如 ['user:add', 'user:edit']
if (!isEmpty(to.meta.auth) && !hasAuth(to.meta.auth)) → 跳转 /403

// role 角色验证 - 如 ['Admin', 'Editor']
if (!isEmpty(to.meta.role) && !hasRole(to.meta.role)) → 跳转 /403

// user 用户名验证 - 如 ['admin', 'zhangsan']
if (!isEmpty(to.meta.user) && !hasUser(to.meta.user)) → 跳转 /403
```

#### (2) 指令级控制 (`directives/permission/`)

| 指令 | 示例 | 说明 |
|------|------|------|
| **v-auth** | `v-auth="['user:add']"` | 无权限则从 DOM 移除元素 |
| **v-role** | `v-role="['Admin']"` | 角色不匹配则移除元素 |
| **v-user** | `v-user="['admin']"` | 用户名不匹配则移除元素 |

#### (3) 函数式权限判断 (`utils/permission/`)

可在代码中手动调用：

```typescript
import hasAuth from '@/utils/permission/hasAuth'
if (hasAuth('user:add')) { /* 显示按钮 */ }
```

**特殊规则**: SuperAdmin 角色拥有所有权限；权限码为 `*` 时拥有所有权限。

### 7.2 路由守卫流程

#### 前置守卫 (`beforeEach`)

```
进入路由
  → 已登录？
    → 是 → 目标是 login？→ 重定向到欢迎页
    → 是 → 无用户信息？→ 请求用户信息 → 刷新菜单/角色/初始化动态路由
    → 是 → 有用户信息？→ 直接放行 next()
    → 否 → 在白名单(whiteRoute)中？→ 放行
    → 否 → 重定向到 login（携带 redirect 参数）
```

#### 后置守卫 (`afterEach`)

```
离开路由 → 关闭进度条(NProgress)
  → 权限(auth)校验 → 不通过跳 403
  → 角色(role)校验 → 不通过跳 403
  → 用户(user)校验 → 不通过跳 403
  → 需要 cache 且非 iframe？→ 加入 KeepAlive 列表
  → 是 iframe 类型？→ 加入 iframe KeepAlive 列表
```

### 7.3 动态路由系统

采用**菜单驱动路由**方案：

1. 用户登录后调用 `/admin/passport/getInfo` 获取用户信息和菜单数据
2. `useRouteStore.initRoutes()` 将菜单转换为路由：
   - 过滤掉 `meta.type === 'B'`（按钮类型，不对应路由）
   - `type === 'I'`（iframe 类型）→ 使用 iframe 容器组件
   - 其他类型通过 `import.meta.glob` 动态匹配组件
3. 将路由添加到根布局下
4. 合并插件的视图路由
5. 触发插件的 `registerRoute` Hook

### 7.4 主题/皮肤系统

#### 四种布局模式

| 布局 | 特征 |
|------|------|
| **classic**(经典) | 顶部 Header + 左侧菜单 + 内容区 |
| **columns**(分栏) | 顶部 Header + 一级菜单 + 二级菜单 + 内容区 |
| **mixed**(混合) | 顶部 Header + 一级菜单 + 二级菜单(浮动) + 内容区 |

#### 三种颜色模式

- `light` - 明亮模式
- `dark` - 暗黑模式
- `autoMode` - 自动跟随系统（白天明亮/夜晚暗黑）

#### 主题色系统 (`hooks/useThemeColor.ts`)

- 设置主色调同时生成 Element Plus 的 9 级浅色 + 9 级深色色阶
- 更新 UnoCSS 和 Element Plus 的 CSS 变量
- 支持侧边栏独立暗色模式

#### 其他视觉特性

- 全局水印（可开关，支持自定义文字）
- 页面过渡动画（fade/slide-left/right/down/up 等）
- 标签页两种风格：rectangle(矩形) / card(卡片)
- 移动端自适应布局（自动隐藏侧边栏）

### 7.5 国际化(i18n)支持

- **框架**: vue-i18n @11.1.2 (Composition API 模式)
- **语言**: 简体中文(zh_CN, 默认)、繁体中文(zh_TW)、英文(en)
- **格式**: YAML 语言包文件（通过 `@intlify/unplugin-vue-i18n` 优化加载）
- **三级语言包**:
  - 全局: `src/locales/*.yaml`
  - 模块级: `src/modules/**/locales/*.yaml`
  - 插件级: `src/plugins/**/locales/*.yaml`
- **回退语言**: zh_CN
- **运行时语言切换**: 存储到缓存 + 更新 store + 更新 i18n 实例 locale

### 7.6 插件系统

#### 插件接口定义

```typescript
interface PluginConfig {
  install: (app: App) => void                    // 插件安装函数
  config: {
    info: { name, version, author, description, order }  // 插件信息
    enable: boolean                                // 是否启用
  }
  views?: Views[]                                  // 可选的路由视图
  hooks?: {
    start                                          // 启动时触发
    setup                                          // 系统初始化完毕后
    registerRoute                                  // 注册路由时
    loginBefore                                    // 登录前
    login                                          // 登录时
    logout                                         // 登出时
    getUserInfo                                    // 获取用户信息时
    routerRedirect                                 // 路由跳转时
    networkRequest                                 // 网络请求时
    networkResponse                                // 网络返回后
  }
}
```

#### 生命周期钩子

- 插件按 `order` 字段排序后依次加载
- 支持运行时启用/禁用插件

### 7.7 KeepAlive 缓存机制

- **普通页面缓存**: 通过 `route.meta.cache` 控制，需组件设置 `name`
- **iframe 页面缓存**: 按 `route.name` 管理
- 标签页关闭时清除对应缓存
- 支持标签页全屏/退出全屏

---

## 八、业务模块说明

内置的 `modules/base` 基础模块涵盖了一个后台管理系统的核心 CRUD 功能：

| 子模块 | 功能 | 主要页面 |
|--------|------|----------|
| **login** | 登录认证 | 虚线/亮色/一句话 |
| **welcome** | 欢迎首页 | 展示系统信息 |
| **dashboard** | 数据仪表盘 | 分析报表 / 工作台（ECharts 图表） |
| **user** | 用户管理 | 列表/表单/角色分配 |
| **role** | 角色管理 | 列表/表单/权限分配 |
| **menu** | 菜单管理 | 树形菜单/表单/按钮权限 |
| **department** | 部门管理 | 树形部门/岗位设置/负责人/查看用户 |
| **log** | 操作日志 | 登录日志 / 操作日志 |
| **dataCenter** | 数据中心 | 附件管理 |
| **uc** | 用户中心 | 个人信息修改 / 密码修改 |

每个 API 文件都导出标准的接口函数，返回 `Promise<ResponseStruct<T>>` 类型。

---

## 九、项目特色与亮点

| 特色              | 详情 |
|-----------------|------|
| **模块化架构**       | `src/modules/` 下按功能组织，每个模块有独立的 api/views/locales |
| **插件化设计**       | 完整的插件系统（安装/卸载/Hooks/路由扩展），支持热插拔 |
| **Provider DI** | 服务提供者模式解耦核心服务 |
| **三套布局**        | classic/columns/mixed 自由切换 |
| **三级权限**        | 路由 meta + v-指令 + 函数调用，auth/role/user 三维度 |
| **动态路由**        | 后端返回菜单 → 前端动态注册路由 |
| **Token 无感刷新**  | 401 自动 refresh_token 刷新，并发请求排队重放 |
| **暗色模式**        | light/dark/autoMode 三种模式，完整色阶计算 |
| **国际化**         | YAML 语言包，zh_CN/zh_TW/en 三语 |
| **离线图标**        | Iconify 图标本地化，按需加载 |
| **原子化 CSS**     | UnoCSS 替代 TailwindCSS，自定义快捷方式 |
| **TSX 布局**      | 布局系统使用 TSX 编写（JSX 渲染函数模式） |
| **移动端适配**       | 响应式断点 + 移动端菜单 + 触控优化滚动条 |
| **水印系统**        | 全局水印，可配置文字，随主题切换 |
| **标签页系统**       | 多标签页管理，支持缓存/固定/全屏/收藏/右键菜单 |
| **全局搜索**        | Ctrl+K 呼出搜索面板 |
| **ProTable**    | 封装的高级搜索+表格一体组件 |
| **Docker 部署**   | 提供 Dockerfile，生产环境指向 hyperf 服务 |

---

## 十、开发指南

### 10.1 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 2888）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行 E2E 测试
npm run test:e2e
```

### 10.2 添加新业务模块

在 `src/modules/` 下创建新模块目录：

```
src/modules/my-module/
├── api/                  # API 接口定义
│   └── xxx.ts
├── views/                # 页面视图
│   └── index.vue
└── locales/              # 模块级语言包
    └── zh_CN.yaml
```

### 10.3 创建新插件

在 `src/plugins/` 下创建插件目录，遵循 `PluginConfig` 接口规范：

```typescript
export default {
  install: (app) => { /* 安装逻辑 */ },
  config: {
    info: { name, version, author, description, order },
    enable: true
  },
  views?: [...],
  hooks?: { /* 生命周期钩子 */ }
}
```

### 10.4 使用自定义组件

项目中的业务通用组件均以 `ma-` 为前缀命名：

```vue
<template>
  <ma-dialog v-model="visible" title="标题">
    <!-- 内容 -->
  </ma-dialog>

  <ma-form-open :options="formOptions" />

  <ma-table :data="tableData" :columns="columns" />
</template>
```

### 10.5 使用 Composables Hooks

```typescript
// 表格操作
const { tableData, loading, fetchData } = useTable(getListApi)

// 表单操作
const { formRef, formModel, submitForm } = useForm(formOptions)

// 消息提示
const { success, error, warning, info } = useMessage()

// 对话框
const { openDialog, closeDialog } = useDialog()

// 图片预览
const { showViewer } = useImageViewer()
```

### 10.6 权限控制示例

```vue
<template>
  <!-- 指令方式 -->
  <button v-auth="['user:add']">添加用户</button>
  <button v-role="['Admin']">管理员操作</button>

  <!-- 函数方式 -->
  <button v-if="hasAuth('user:edit')">编辑用户</button>
</template>

<script setup>
import hasAuth from '@/utils/permission/hasAuth'
</script>
```

### 10.7 代码规范

- **组件命名**: PascalCase（如 `MaDialog.vue`）
- **文件组织**: 每个功能模块独立目录，包含 api/views/locales
- **类型优先**: 充分利用 TypeScript 类型系统
- **组合式 API**: 使用 `<script setup>` 语法糖
- **自动导入**: Vue/VueRouter/Pinia/API/hooks/stores 无需手动导入

---

## 附录

### A. 关键文件索引

| 文件路径 | 重要度 | 说明 |
|----------|--------|------|
| `src/bootstrap.ts` | ⭐⭐⭐ | 应用引导程序入口 |
| `src/router/index.ts` | ⭐⭐⭐ | 路由守卫与权限校验 |
| `src/utils/http.ts` | ⭐⭐⭐ | HTTP 封装与 Token 刷新 |
| `src/store/modules/useUserStore.ts` | ⭐⭐⭐ | 用户状态管理 |
| `src/store/modules/useRouteStore.ts` | ⭐⭐⭐ | 动态路由注册 |
| `src/store/modules/useSettingStore.ts` | ⭐⭐⭐ | 系统设置管理 |
| `src/layouts/index.tsx` | ⭐⭐⭐ | 核心布局容器 |
| `src/provider/settings/index.ts` | ⭐⭐ | 全局配置 Provider |
| `src/provider/plugins/index.ts` | ⭐⭐ | 插件系统 Provider |
| `types/global.d.ts` | ⭐⭐ | 全局类型定义 |
| `hooks/useThemeColor.ts` | ⭐⭐ | 主题色计算逻辑 |

### B. 相关链接

- **官方文档**: https://doc.mineadmin.com
- **GitHub 仓库**: https://github.com/mineadmin
- **问题反馈**: https://github.com/mineadmin/mineadmin-vue/issues

---
