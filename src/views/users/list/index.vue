<script>
export default { name: 'users:list' }
</script>
<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :crud="crud" :columns="columns" ref="crudRef">
      <!-- 状态列 -->
      <template #status="{ record }">
        <a-switch
          :checked-value="1"
          unchecked-value="2"
          @change="switchStatus($event, record)"
          :default-checked="record.status === 1"
        />
      </template>
    </ma-crud>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import users from '@/api/users/users'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()

const numberOperation = (newValue, id, numberName) => {
  users
    .numberOperation({ id, numberName, numberValue: newValue })
    .then(res => {
      res.success && Message.success(res.message)
    })
    .catch(e => {
      console.log(e)
    })
}

const switchStatus = (status, record) => {
  users
    .changeStatus({ id: record.id, status })
    .then(res => {
      res.success && Message.success(res.message)
    })
    .catch(e => {
      console.log(e)
    })
}

const crud = reactive({
  rowSelection: {
    showCheckedAll: true,
  },
  searchLabelWidth: '75px',
  pk: 'id',
  api: users.getList,
  recycleApi: users.getRecycleList,
  add: {
    show: true,
    api: users.save,
    auth: ['users:list:save'],
  },
  edit: {
    show: true,
    api: users.update,
    auth: ['users:list:update'],
  },
  delete: {
    show: true,
    api: users.delete,
    auth: ['users:list:delete'],
    realApi: users.realDeletes,
    realAuth: ['users:list:realDeletes'],
  },
  recovery: {
    show: true,
    api: users.recoverys,
    auth: ['users:list:recovery'],
  },
})

const columns = reactive([
  {
    title: '登录名称',
    dataIndex: 'user_name',
    formType: 'input',
    search: true,
    width: 150,
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    formType: 'input',
    search: true,
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    formType: 'select',
    width: 100,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    formType: 'input',
  },
  {
    title: '更新时间',
    dataIndex: 'updated_at',
    formType: 'input',
  },
  {
    title: '年级id',
    dataIndex: 'grade_id',
    formType: 'input',
  },
  {
    title: '省',
    dataIndex: 'province_id',
    formType: 'input',
  },
  {
    title: '市',
    dataIndex: 'city_id',
    formType: 'input',
  },
  {
    title: '区',
    dataIndex: 'area_id',
    formType: 'input',
  },
  {
    title: '0内部 1外部',
    dataIndex: 'user_type',
    formType: 'input',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    formType: 'input',
  },
  {
    title: '所属平台',
    dataIndex: 'platform',
    formType: 'input',
  },
  {
    title: '连续签到天数',
    dataIndex: 'days',
    formType: 'input',
  },
  {
    title: '积分',
    dataIndex: 'score',
    formType: 'input',
  },
])
</script>
