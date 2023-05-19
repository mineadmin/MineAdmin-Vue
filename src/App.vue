<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<script setup>
  import { checkVersion } from 'version-rocket'
  import { version, admin_name } from '../package.json'
  import cn from '@arco-design/web-vue/es/locale/lang/zh-cn'
  import en from '@arco-design/web-vue/es/locale/lang/en-us'
  import { ref } from 'vue'
  import { useAppStore } from './store'
  const appStore = useAppStore()
  const lang = ref(appStore.language === 'zh_CN' ? cn : en)

  // checkVersion({
  //     localPackageVersion: version,
  //     originVersionFileUrl: `${location.origin}/version.json`,
  //     // 更多配置选项请参考 API
  // },{
  //     title:admin_name,
  //     description:"有新版本更新",
  //     buttonText:"立即更新",
  //     // cancelButtonText:"稍后更新",
  // })
</script>

<template>
  <a-config-provider :locale="lang">
    <router-view />
  </a-config-provider>
</template>