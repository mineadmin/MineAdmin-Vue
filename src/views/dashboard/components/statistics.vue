<template>

  <st-welcome />
  <st-count />
  <st-login-chart />

  <div class="flex justify-between mt-3">
    <div class="w-full lg:w-9/12 ma-content-block rounded-sm p-3">asdasd</div>
    <div class="w-full lg:w-3/12 ma-content-block rounded-sm ml-3 p-3">
      <div class="flex">
        MineAdmin 相关
      </div>
      <div class="flex w-10/12 justify-center mx-auto mt-3">
        <img src="https://gitee.com/xmo/MineAdmin/badge/star.svg?theme=dark" />
        <img class="ml-10" src="https://gitee.com/xmo/MineAdmin/badge/fork.svg?theme=dark" />
      </div>
      <div class="block lg:grid lg:grid-cols-2 lg:gap-1 mt-3">
        <a-card class="rounded-sm text-center" :body-style="{ padding: 0 }" :bordered="false">
          <a-button type="outline" class="w-4/5">官方网站</a-button>
        </a-card>
        <a-card class="rounded-sm text-center" :body-style="{ padding: 0 }" :bordered="false">
          <a-button type="outline" class="w-4/5">开发文档</a-button>
        </a-card>
        <a-card class="rounded-sm text-center mt-2" :body-style="{ padding: 0 }" :bordered="false">
          <a-button type="outline" class="w-4/5">Github</a-button>
        </a-card>
        <a-card class="rounded-sm text-center mt-2" :body-style="{ padding: 0 }" :bordered="false">
          <a-button type="outline" class="w-4/5">Gitee </a-button>
        </a-card>
        <a-card class="rounded-sm text-center mt-2" :body-style="{ padding: 0 }" :bordered="false">
          <a-button type="outline" class="w-4/5">更新日志</a-button>
        </a-card>
        <a-card class="rounded-sm text-center mt-2" :body-style="{ padding: 0 }" :bordered="false">
          <a-button type="outline" class="w-4/5">常见问题</a-button>
        </a-card>
      </div>
      <div class="w-11/12 mx-auto mt-3">
        <a-tag class="ml-0.5">MineAdmin v{{ config.version }} release</a-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
  import stCount from './components/st-count.vue'
  import stWelcome from './components/st-welcome.vue'
  import stLoginChart from './components/st-loginChart.vue'

  import config from '@/../package.json'
</script>

