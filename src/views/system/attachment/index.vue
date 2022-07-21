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
  <div class="ma-content-block lg:flex justify-between p-4">
    <div class="lg:w-2/12 w-full h-full p-2 shadow">
      <ma-tree-slider
        v-model="sliderData"
        :search-placeholder="$t('maResource.searchResource')"
        :field-names="{ title: 'title', key: 'key' }"
        @click="handlerClick"
        icon="icon-folder"
        :selected-keys="['all']"
      />
    </div>

    <div class="lg:w-10/12 w-full lg:ml-4 mt-5 lg:mt-0">
      <!-- CRUD 组件 -->
      <ma-crud :crud="crud" :columns="columns" ref="crudRef">
        
      </ma-crud>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, reactive, computed } from 'vue'
  import attachment from '@/api/system/attachment'
  import user from '@/api/system/user'
  import commonApi from '@/api/common'
  import { useI18n } from 'vue-i18n'
  import { Message, Modal } from '@arco-design/web-vue'

  const { t } = useI18n()
  const crudRef = ref()
  const sliderData = ref([])
  const selecteds = ref([])

  onMounted(async () => {
    const treeData = await commonApi.getDict('attachment_type')
    treeData.data.unshift({ title: '所有', key: 'all' })
    sliderData.value = treeData.data
    // await getAttachmentList({pageSize: 1})

    if (props.multiple) {
      selecteds.value = []
    }
  })

  const crud = reactive({
    api: attachment.getPageList,
    recycleApi: attachment.getRecyclePageList,
    showIndex: false,
    searchLabelWidth: '75px',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 200,
    delete: {
      show: true,
      api: user.deletes, auth: ['system:attachment:delete'],
      realApi: user.realDeletes, realAuth: ['system:attachment:realDeletes']
    },
    recovery: { show: true, api: user.recoverys, auth: ['system:attachment:recovery']},
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
export default { name: 'system:attachment' }
</script>

<style scoped>

</style>