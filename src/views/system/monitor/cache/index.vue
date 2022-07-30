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
  <a-layout-content>
    <div class="ma-content-block lg:flex p-4">
      <div class="flex justify-between w-full redis-info mt-3">
        <a-descriptions :column="2" size="large" bordered title="Redis信息" class="lg:w-10/12 w-full">
          <a-descriptions-item label="Redis版本">{{ server.version }}</a-descriptions-item>
          <a-descriptions-item label="客户端连接数">{{ server.clients }}</a-descriptions-item>
          <a-descriptions-item label="运行模式">{{ server.redis_mode }}</a-descriptions-item>
          <a-descriptions-item label="运行天数">{{ server.run_days }}</a-descriptions-item>
          <a-descriptions-item label="端口">{{ server.port }}</a-descriptions-item>
          <a-descriptions-item label="AOF状态">{{ server.aof_enabled }}</a-descriptions-item>
          <a-descriptions-item label="已过期key">{{ server.expired_keys }}</a-descriptions-item>
          <a-descriptions-item label="系统使用key">{{ server.sys_total_keys }}</a-descriptions-item>
        </a-descriptions>
        <div class="echarts hidden lg:block">
          <ma-chart :options="options" width="330px" height="330px" />
        </div>
      </div>
    </div>

    <div class="ma-content-block p-4 mt-3">
      <div class="text-base">缓存数据管理</div>
      <div class="mt-5 lg:flex justify-between">
        <a-table class="lg:w-8/12 w-full" :data="data" :columns="columns">
          <template #operation="{ record }">
            <a-space>
              <a-link @click="viewKey(record.name)">查看</a-link>
              <a-popconfirm content="确实要删除该缓存吗?" position="bottom" @ok="del(record)">
                <a-link>删除</a-link>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
        <a-textarea v-model="content" class="lg:w-4/12 w-full lg:ml-5 mt-3 lg:mt-0" readonly />
      </div>
    </div>
  </a-layout-content>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import monitor from '@/api/system/monitor'
  import { Message } from '@arco-design/web-vue'
  import { refreshTag } from '@/utils/common'

  const options = ref({})
  const server = ref({})
  const data = ref([])
  const content = ref('')
  const columns = reactive([
    { title: '缓存键名', dataIndex: 'name' },
    { title: '操作', slotName: 'operation', width: 150, align:'right' },
  ])

  const viewKey = async (key) => {
    const response = await monitor.view({ key })
    content.value = response.data.content
  }

  const del = async (row) => {
    const response = await monitor.deleteKey({ key: row.name })
    if (response.success) {
      Message.success(response.message)
      refreshTag()
    }
  }

  const getCacheInfo = async () => {
    const response = await monitor.getCacheInfo()
    server.value = response.data.server
    response.data.keys.map(item => {
      data.value.push({ name: item })
    })
    options.value = {
      tooltip: {
        formatter: '{b} : {c} kb'
      },
      series: [
        {
          name: '内存占用情况',
          type: 'gauge',
          min: 0,
          max: 5 * 1024,
          progress: {
            show: true
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}'
          },
          data: [
            {
              value: parseInt(response.data.server.use_memory),
              name: 'Redis占用内存'
            }
          ]
        }
      ]
    }
  }

  getCacheInfo()
</script>

<script>
export default { name: 'system:cache' }
</script>

<style scoped>
.redis-info {
  max-height: 260px; overflow: hidden;
}
.echarts {
  position: relative;
  top: -10px; right: -10px;
}
</style>