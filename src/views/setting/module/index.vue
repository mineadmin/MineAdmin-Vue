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
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #operationCell="{ record }">

        <a-popconfirm
          @ok="handleInstall(record)"
          :content="`确定安装模块数据？如表和数据已存在则可能无效！`"
          position="bottom"
        >
          <a-link v-auth="['setting:module:install']"><icon-record /> 安装数据</a-link>
        </a-popconfirm>

        <a-popconfirm
          @ok="switchEnbaled(record)"
          :content="`确定要${ record.enabled ? '停用' : '启用'}${record.label}吗?`"
          position="bottom"
        >
          <a-link v-auth="['setting:module:status']" v-if="record.enabled"><icon-info-circle /> 停用</a-link>
          <a-link v-auth="['setting:module:status']" v-else><icon-check-circle /> 启用</a-link>
        </a-popconfirm>

        <a-link
          @click="openDeleteModal(record)"
          v-auth="['setting:module:delete']"
        ><icon-delete /> 删除</a-link>
      </template>
    </ma-crud>

    <a-modal v-model:visible="visible" type="warning" :on-before-ok="deleteModule">
      <template #title>危险操作</template>
      <div class="mb-2">
        确定要删除 <span class="text-red-500 underline font-black">{{ currentModule.label }}</span> 模块吗？
      </div>
      <div>
        此操作会删除文件和数据表，如果执行请在下面输入框输入：<span class="text-red-500">{{ currentModule.name }}</span>
      </div>
      <a-input :placeholder="`请输入 ${currentModule.name}`" class="mt-2" v-model="name" />
    </a-modal>
  </div>
</template>

<script setup>
  import { ref, reactive, h } from 'vue'
  import module from '@/api/setting/module'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()
  const name = ref()
  const visible = ref(false)
  const currentModule = ref({})

  const switchEnbaled = async (record) => {
    if (record.name == 'System' || record.name == 'Setting') {
      Message.info(record.label + ' 是系统核心模块，不能操作')
      return false
    }
    const text = record.enabled ? '停用' : '启用'
    const response = await module.modifyStatus({ name: record.name, status: !record.enabled })
    response.success && Message.success(`模块${text}成功`)
    crudRef.value.refresh()
  }

  const handleInstall = async (record) => {
    if (record.name == 'System' || record.name == 'Setting') {
      Message.info(record.label + ' 是系统核心模块，不能操作')
      return false
    }
    const response = await module.install({ name: record.name })
    response.success && Message.success(response.message)
  }

  const deleteModule = async (done) => {
    if (name.value !== currentModule.value.name) {
      Message.error(`输入错误，验证失败`)
      done(false)
      return
    }

    const response = await module.deletes({ name: name.value })
    if (response.success) {
      Message.success('模块删除成功')
      crudRef.value.refresh()
      currentModule.value = {}
      done(true)
    }
  }

  const openDeleteModal = async (record) => {
    if (record.name == 'System' || record.name == 'Setting') {
      Message.info(record.label + ' 是系统核心模块，不能删除')
      return false
    }
    currentModule.value = record
    visible.value = true
  }

  const crud = reactive({
    pk: 'name',
    formExcludePk: false,
    api: module.getPageList,
    showIndex: false,
    searchColNumber: 3,
    pageLayout: 'fixed',
    operationColumn: true,
    operationWidth: 240,
    add: { show: true, api: module.save, auth: ['setting:module:save'] },
  })

  const columns = reactive([
    { 
      title: '模块名称', dataIndex: 'name', search: true, width: 120,
      placeholder: '请输入模块名称（英文标识）',
      commonRules: [
        { required: true, message: '模块名称必填' },
        { validator: (value, callback) => {
            if (! /^[A-Za-z]{2,}$/g.test(value)) {
              callback('模块必须是2位以上的英文')
            }
          }
        }
      ],
    },
    { 
      title: '模块标签', dataIndex: 'label', search: true, width: 120,
      placeholder: '请输入模块标签（中文名称）',
      commonRules: [ { required: true, message: '模块标签必填' } ],
    },
    {
      title: '版本号', dataIndex: 'version', width: 100, placeholder: '请输入版本号',
      commonRules: [
        { required: true, message: '版本号必填' },
        { validator: (value, callback) => {
            if (! /^[0-9\.]{3,}$/g.test(value)) {
              callback('版本号必须包含数字和小数点')
            }
          }
        }
      ],
    },
    {
      title: '描述', dataIndex: 'description', formType: 'textarea',
      placeholder: '请输入模块的功能描述', width: 400,
      commonRules: [{ required: true, message: '描述必填' }],
    },
    {
      title: '状态', dataIndex: 'enabled', formType: 'radio', addDisplay: false, editDisplay: false, width: 120,
      dict: { data: [ { label: '开启', value: true }, { label: '禁用', value: false } ], translation: true },
    }
  ])
</script>

<script>
export default { name: 'setting:module' }
</script>

<style scoped>

</style>