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
  <div class="w-full lg:w-9/12 ma-content-block rounded-sm p-3 mt-3">
    <div class="flex justify-between">
      系统公告
      <a-link>更多</a-link>
    </div>
    <a-table :data="data" :columns="columns" class="mt-2" :pagination="false">
      <template #title="{ record }">
        <a-link @click="viewDetail(record)">{{ record.title }}</a-link>
      </template>
    </a-table>

    <a-modal v-model:visible="detailVisible" fullscreen :footer="false">
      <template #title>公告详情</template>
      <a-typography :style="{ marginTop: '-30px' }">
        <a-typography-title class="text-center">
          {{ row?.title }}
        </a-typography-title>
        <a-typography-paragraph class="text-right" style="font-size: 13px; color: var(--color-text-3)">
          <a-space size="large">
            <span>创建时间：{{ row?.created_at }}</span>
          </a-space>
        </a-typography-paragraph>
        <a-typography-paragraph>
          <div v-html="row?.content" ></div>
        </a-typography-paragraph>
      </a-typography>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import commonApi from '@/api/common';

const data = ref([])
const columns = reactive([
  { title: '标题', dataIndex: 'title', slotName: 'title' },
  { title: '发布时间', dataIndex: 'created_at', width: 180, align: 'right' },
])

const row = ref({})
const detailVisible = ref(false)

const viewDetail = async (record) => {
  row.value = record
  detailVisible.value = true
}

const getNoticeList = async () => {
  const res = await commonApi.getNoticeList({ pageSize: 5, orderBy: 'id', orderType: 'desc' })
  data.value = res.data.items
}



getNoticeList()
</script>