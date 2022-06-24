<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<template>
  <div class="ma-content-block p-5">
    <ma-upload v-model="ok" multiple></ma-upload>
    {{ ok }}

    <ma-upload v-model="ok1" :onlyUrl="false"></ma-upload>
    {{ ok1 }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
const ok = ref(
  [
]
)

const ok1 = ref()
// http://127.0.0.1:9501/uploadfile/20220624/398803883821895681.jpg
// 

</script>

<style scoped>

</style>