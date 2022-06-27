<template>
  <div class="ma-content-block">
    <a-space class="flex">
      <a-button type="primary" @click="visible = true"><icon-select-all /> 选择用户</a-button>
      <a-tag size="large">已选择 0 位用户</a-tag>
    </a-space>
    <a-modal v-model:visible="visible" width="1000px" draggable>
      <template #title>选择用户</template>
      <a-tabs position="left">
        <a-tab-pane key="condition" title="按条件">
          <ma-crud :crud="crud" :columns="columns" />
        </a-tab-pane>
        <a-tab-pane key="dept" title="按部门">
          Content of Tab Panel 2
        </a-tab-pane>
        <a-tab-pane key="role" title="按角色">
          Content of Tab Panel 3
        </a-tab-pane>
        <a-tab-pane key="post" title="按岗位">
          Content of Tab Panel 3
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import commonApi from '@/api/common'

  const visible = ref(false)
  
  const crud = ref({
    api: commonApi.getUserList,
    add: { show: true },
    import: { show: true },
    export: { show: true },
    edit: { show: true}, 
    operationColumn: true
  })

  const columns = ref([
    {
      title: '账户',
      dataIndex: 'username',
      search: true,
    }
  ])
</script>

<style scoped>

</style>