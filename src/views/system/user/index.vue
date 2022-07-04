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
    <ma-tree-slider
      v-model="depts"
      searchPlaceholder="搜索部门"
      :props="{ title: 'label', key: 'value' }"
      class="lg:w-2/12 w-full h-full"
      :selectedKeys="['all']"
      @click="switchDept"
    />
    <div class="lg:w-10/12 w-full lg:ml-4 mt-5 lg:mt-0">
      <!-- CRUD 组件 -->
      <ma-crud :crud="crud" :columns="columns" ref="crudRef">
        <!-- 状态列 -->
        <template #status="{ record }">
          <a-switch :checked-value="1"  unchecked-value="2" :default-checked="record.status == 1" />
        </template>
        <!-- 头像列 -->
        <template #avatar="{ record }">
          <a-avatar>
            <img :src="record.avatar || '/avatar.jpg'" style="object-fit: cover" />
          </a-avatar>
        </template>
        <!-- 操作列 -->
        <template #operationCell="{ record }">
          <div v-if="record.id == 1">
            <a-link><icon-refresh /> 更新缓存</a-link>
          </div>
        </template>
      </ma-crud>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, reactive } from 'vue'
  import dept from '@/api/system/dept'
  import user from '@/api/system/user'

  const depts = ref([])
  const crudRef = ref()

  onMounted(() => {
    dept.tree().then(res => {
      depts.value = res.data
      depts.value.unshift({ label: '所有部门', value: 'all' })
    })
  })

  const switchDept = (id) => {
    crud.requestParams = id[0] === 'all' ? { dept_id: undefined } : { dept_id: id[0] }
    crudRef.value.requestData()
  }

  const crud = reactive({
    api: user.getPageList,
    recycleApi: user.getRecyclePageList,
    showIndex: false,
    searchLabelWidth: '75px',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    add: { show: true, api: user.save, auth: ['system:user:add'] },
    edit: { show: true, api: user.update, auth: ['system:user:edit'] },
    delete: {
      show: true,
      api: user.deletes, auth: ['system:user:delete'],
      realApi: user.realDeletes, realAuth: ['system:user:realDeletes']
    },
    recovery: { show: true, api: user.recoverys, auth: ['system:user:recovery']},
    import: { show: true, },
    export: { show: true, },
    viewLayoutSetting: { layout: 'customer', width: 800, cols: 2 },
    isDbClickEdit: false
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50 },
    {
      title: '头像', dataIndex: 'avatar', width: 75, formType: 'upload',
      type: 'image', rounded: true, span: 24, labelWidth: '86px'
    },
    { 
      title: '账户', dataIndex: 'username', width: 130, search: true,
      rules: [{ required: true, message: '账户必填' }], span: 12
    },
    {
      title: '所属部门', dataIndex: 'dept_id', hide: true, formType: 'tree-select', span: 12,
      dict: { url: 'system/dept/tree' }, rules: [{ required: true, message: '所属部门必选' }]
    },
    { 
      title: '密码', dataIndex: 'password', hide: true, autocomplete: 'off',
      addDefaultValue: '123456', editDefaultValue: '', type: 'password', 
      span: 12, addRules: [{ required: true, message: '密码必填' }],
    },
    { title: '昵称', dataIndex: 'nickname', width: 120, span: 12 },
    { 
      title: '角色', dataIndex: 'role_ids', width: 120, span: 12, formType: 'select', multiple: true,
      dict: { url: 'system/role/list', props: { label: 'name', value: 'id' } }, hide: true, 
      rules: [{ required: true, message: '角色必选' }],
      editDefaultValue: async (record) => {
        const response = await user.read(record.id)
        const ids = response.data.roleList.map(item => item.id )
        return ids
      }
    },
    {
      title: '手机', dataIndex: 'phone', width: 150, search: true, span: 12,
      addRules: [{ match: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码' }]
    },
    { 
      title: '岗位', dataIndex: 'post_ids', width: 120, span: 12, formType: 'select', multiple: true,
      dict: { url: 'system/post/list', props: { label: 'name', value: 'id' } }, hide: true,
      editDefaultValue: async (record) => {
        const response = await user.read(record.id)
        const ids = response.data.postList.map(item => item.id )
        return ids
      }
    },
    {
      title: '邮箱', dataIndex: 'email', width: 200, search: true, span: 12,
      addRules: [{ type: 'email', message: '请输入正确的邮箱' }]
    },
    {
      title: '状态', dataIndex: 'status', width: 100, search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
      addDefaultValue: '1', labelWidth: '86px'
    },
    {
      title: '备注', dataIndex: 'remark', width: 180, hide: true,
      formType: 'textarea', labelWidth: '86px'
    },
    {
      title: '注册时间', dataIndex: 'created_at', width: 180, addDisplay: false, editDisplay: false,
      search: true, formType: 'range'
    },
  ])
</script>

<script>
export default { name: 'system:user' }
</script>

<style scoped>

</style>