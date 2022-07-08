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
  <div class="ma-content-block lg:h-full lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :crud="crud" :columns="columns" ref="crudRef">
      <!-- 排序列 -->
      <template #sort="{ record }">
        <a-input-number
          :default-value="record.sort"
          mode="button"
          @change="changeSort($event, record.id)"
          :min="0"
          :max="1000"
        />
      </template>
      <!-- 图标列 -->
      <template #icon="{ record }">
        <component :is="record.icon" v-if="record.icon" />
      </template>
      <!-- 状态列 -->
      <template #status="{ record }">
        <a-switch
          :checked-value="1" 
          unchecked-value="2"
          @change="changeStatus($event, record.id)"
          :default-checked="record.status == 1"
        />
      </template>
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import menu from '@/api/system/menu'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()
  const menuType = [
    { label: '菜单', code: 'M' },
    { label: '按钮', code: 'B' },
    { label: '外链', code: 'L' },
    { label: 'iFrame', code: 'I' },
  ]

  const changeStatus = async (status, id) => {
    const response = await menu.changeStatus({ id, status })
    if (response.success) {
      Message.success(response.message)
    }
  }


  const changeSort = async (value, id) => {
    const response = await menu.numberOperation({ id, numberName: 'sort', numberValue: value })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const crud = reactive({
    api: menu.getList,
    recycleApi: menu.getRecycleList,
    showIndex: false,
    searchLabelWidth: '75px',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 200,
    add: { show: true, api: menu.save, auth: ['system:menu:add'] },
    edit: { show: true, api: menu.update, auth: ['system:menu:edit'] },
    delete: {
      show: true,
      api: menu.deletes, auth: ['system:menu:delete'],
      realApi: menu.realDeletes, realAuth: ['system:menu:realDeletes']
    },
    recovery: { show: true, api: menu.recoverys, auth: ['system:menu:recovery']},
    isExpand: true,
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    {
      title: '上级菜单', dataIndex: 'parent_id', hide: true, formType: 'tree-select', 
      dict: { url: 'system/menu/tree' },
      editDefaultValue: (record) => {
        return record.parent_id == 0 ? undefined : record.parent_id
      }
    },
    { 
      title: '菜单名称', dataIndex: 'name', search: true, rules: [{ required: true, message: '菜单名称必填' }], width: 150,
    },
    { 
      title: '菜单类型', dataIndex: 'type', hide: true, formType: 'radio', addDefaultValue: 'M', 
      dict: { data: menuType, props: { label: 'label', value: 'code' } },
      control: (value) => {
        if ( value == 'B') {
          return {
            'icon': { title: '图标哈哈' },
            'component': { display: false }
          }
        } else {
          return {
            'icon': { title: '图标' },
            'component': { display: true }
          }
        }
      },
    },
    {  title: '图标', dataIndex: 'icon', width: 80, },
    { 
      title: '菜单标识', dataIndex: 'code', search: true, rules: [{ required: true, message: '菜单标识必填' }], width: 150,
    },
    { title: '视图组件', dataIndex: 'component', width: 220,},
    {
      title: '排序', dataIndex: 'sort', formType: 'input-number', addDefaultValue: 1, width: 180,
      min: 0, max: 1000
    },
    {
      title: '状态', dataIndex: 'status', search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
      addDefaultValue: '1', width: 120,
    },
    {
      title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
    },
    {
      title: '创建时间', dataIndex: 'created_at', addDisplay: false, editDisplay: false,
      search: true, formType: 'range', width: 150,
    },
  ])
</script>

<script>
export default { name: 'system:menu' }
</script>

<style scoped>
.icon {
  width: 1em;
}
</style>