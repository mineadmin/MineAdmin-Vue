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
  <div class="ma-content-block p-4">
    <ma-form v-model="form" v-model:columns="columns" @submit="submit">
    </ma-form>
    {{ form }}


  </div>
</template>

<script setup>
import { ref } from 'vue'
const form = ref({ area: { province: '北京市' }})

const submit = (data, done) => {
  console.log(data)
}

const columns = ref([
  {
    title: '用户信息',
    dataIndex: 'username',
    formType: 'user-info'
  },
  {
    title: '地区',
    dataIndex: 'area',
    formType: 'city-linkage',
  },
  {
    title: '子表单',
    formType: 'form-group',
    dataIndex: 'datas',
    childrenOptions: {
      layout: 'customer'
    },
    children: [
      {
        title: '型号',
        dataIndex: 'xinghao',
        rules: [{
          required: true,
          message: '请输入型号'
        }],
        span: 12
      },
      {
        title: '图片',
        dataIndex: 'img',
        formType: 'select-user',
        span: 12,
      },
      {
        title: '演示例子',
        dataIndex: 'ate',
        formType: 'select',
        span: 24,
      }
    ]
  }
])
</script>

<script>
export default { name: 'demo' }
</script>

<style scoped>

</style>