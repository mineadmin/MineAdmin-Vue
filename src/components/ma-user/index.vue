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
  <div class="ma-content-block">
    <a-space class="flex">
      <a-button type="primary" @click="visible = true"><icon-select-all /> 选择用户</a-button>
      <a-tag size="large" color="blue">已选择 {{ _.isArray(selecteds) ? selecteds.length : 0 }} 位用户</a-tag>
      <a-input-tag v-model="userList" :style="{ width:'320px' }" placeholder="请点击前面按钮选择用户" :max-tag-count="3" disabled/>
    </a-space>

    <a-modal v-model:visible="visible" width="1000px" draggable :on-before-ok="close" unmountOnClose>
      <template #title>选择用户</template>

      <ma-crud
        ref="crudRef"
        :crud="crud"
        :columns="columns"
        v-model:selected-keys="selecteds"
        @selection-change="selectHandler"
      />
    </a-modal>
  </div>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue'
  import commonApi from '@/api/common'
  import { Message } from '@arco-design/web-vue'
  import _ from 'lodash'

  const props = defineProps({
    modelValue: { type: Array },
    isEcho: { type: Boolean, default: false },
    onlyId: { type: Boolean, default: true }
  })

  const emit = defineEmits(['update:modelValue'])

  const visible = ref(false)
  const selecteds = ref([])
  const userList = ref([])

  onMounted(() => {
    if (props.isEcho && props.onlyId) selecteds.value = props.modelValue
  })

  watch(
    ()  => props.modelValue,
    val => {
      if (props.isEcho && props.onlyId) selecteds.value = val
    }
  )

  const selectHandler = (rows) => {
    selecteds.value = rows
  }

  const close = async (done) => {
    if (_.isArray(selecteds.value) && selecteds.value.length > 0) {
      const response = await commonApi.getUserInfoByIds({ ids: selecteds.value })
      if (! _.isEmpty(response) && _.isArray(response.data)) {
        userList.value = response.data.map( item => {
          return `${item.username}(${item.id})`
        })
        if (props.onlyId) {
          emit('update:modelValue', selecteds.value)
        } else {
          emit('update:modelValue', response.data)
        }
        Message.success('选择成功')
      }
    } else {
      emit('update:modelValue', [])
      userList.value = []
    }
    done(true)
  }
  
  const crud = ref({
    showIndex: false,
    api: commonApi.getUserList,
    rowSelection: { type: 'checkbox', showCheckedAll: true }
  })

  const columns = ref([
    { title: '账户', dataIndex: 'username', search: true },
    { title: '昵称', dataIndex: 'nickname', search: true },
    { title: '手机', dataIndex: 'phone', search: true },
    { title: '邮箱', dataIndex: 'email', search: true },
    {
      title: '部门',
      dataIndex: 'dept_id',
      search: true,
      formType: 'tree-select',
      hide: true,
      dict: { url: 'system/common/getDeptTreeList' }
    },
    {
      title: '角色',
      dataIndex: 'role_id',
      search: true,
      formType: 'select',
      hide: true,
      dict: { url: 'system/common/getRoleList', props: { label: 'name', value: 'code' } }
    },
    {
      title: '岗位',
      dataIndex: 'post_id',
      search: true,
      formType: 'select',
      hide: true,
      dict: { url: 'system/common/getPostList', props: { label: 'name', value: 'code' } }
    },
  ])
</script>

<style scoped>
:deep(.arco-tabs-nav-type-capsule .arco-tabs-nav-tab) {
  justify-content: flex-start;
}
</style>