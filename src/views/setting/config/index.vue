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
  <div class="lg:flex justify-between">
    <div class="ma-content-block p-5 h-full lg:w-1/2">
      <a-tabs
        type="rounded"
        v-model:active-key="active"
        @delete="openDeleteModal"
        :editable="true"
        @change="handlerChangeTabs"
        auto-switch
      >
        <template #extra>
          <a-tooltip content="添加组">
            <a-button shape="round" @click="addGroupModal" type="primary">
              <template #icon><icon-plus /></template>
            </a-button>
          </a-tooltip>
        </template>
        <a-tab-pane
          v-for="item in configGroupData"
          :key="item.id"
          :title="item.name"
        >
          <ma-form
            v-model="formArray[item.id]"
            v-model:columns="optionsArray[item.id]"
            @submit="submit"
            class="mt-3"
            ref="maFormRef"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="ma-content-block p-5 h-full lg:w-1/2 lg:ml-3 mt-3 lg:mt-0">
      
    </div>

    <a-modal v-model:visible="deleteVisible" type="warning" :on-before-ok="deleteConfigGroup">
      <template #title>危险操作</template>
      <div class="mb-2">
        确定要删除 <span class="text-red-500 underline font-black">{{ deleteGroupData.name }}</span> 模块吗？
      </div>
      <div>
        此操作会删除组和所属组配置项，如果执行请在下面输入框输入：<span class="text-red-500">{{ deleteGroupData.name }}</span>
      </div>
      <a-input :placeholder="`请输入 ${deleteGroupData.name}`" class="mt-2" v-model="name" />
    </a-modal>
  </div>
</template>

<script setup>
  import { nextTick, ref } from 'vue'
  import config from '@/api/setting/config'
  import { Message } from '@arco-design/web-vue'

  const active = ref(0)
  const name = ref('')
  const deleteGroupData = ref({ name: '' })
  const maFormRef = ref()
  const formArray = ref({})
  const optionsArray = ref([])
  const configGroupData = ref([])
  const deleteVisible = ref(false)

  const openDeleteModal = (id) => {
    deleteGroupData.value = configGroupData.value.find(item => item.id == id)
    deleteVisible.value = true
  }

  const getConfigGroupList = async (defaultKey = 1) => {
    const response = await config.getConfigGroupList()
    configGroupData.value = response.data
    configGroupData.value.map(item => {
      formArray.value[item.id] = {}
      optionsArray.value[item.id] = []
    })
    setActiveTabs(defaultKey)
  }

  const setActiveTabs = async (id) => {
    const params = {
      group_id: id,
      orderBy: 'sort',
      orderType: 'desc'
    }
    const response = await config.getConfigList(params)
    let form = {}
    optionsArray.value[id] = response.data.map(item => {
      let option = { title: item.name, dataIndex: item.key, formType: item.input_type, dict: {} }
      const allowDictType = ['select', 'radio', 'checkbox']
      if (allowDictType.includes(item.input_type)) {
        option.dict = { data: item.config_select_data }
      }
      form[item.key] = item.value
      return option
    })
    formArray.value[id] = form
    active.value = id
    nextTick(() => {
      maFormRef.value[id] && maFormRef.value[id].init()
    })
  }

  const handlerChangeTabs = (id) => {
    setActiveTabs(id)
  }

  const addGroupModal = () => {

  }

  const deleteConfigGroup = async (done) => {
    if (name.value !== deleteGroupData.value.name) {
      Message.error(`输入错误，验证失败`)
      done(false)
      return
    }

    const response = await config.deleteConfigGroup({ id: deleteGroupData.value.id })
    if (response.success) {
      Message.success('配置删除成功')
      deleteGroupData.value = {}
      done(true)
    }
  }

  const submit = (data, done) => {
    
  }

  getConfigGroupList()
</script>
<script>
export default { name: 'system' }
</script>

<style scoped>

</style>