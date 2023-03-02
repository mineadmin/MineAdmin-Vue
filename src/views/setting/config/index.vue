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
        @change="handleChange"
        :updateable="true"
        auto-switch
        :editable="true"
      >
        <template #extra>
          <a-space>
            <a-tooltip content="添加组">
              <a-button shape="round" @click="addGroupModal" type="primary" v-auth="['setting:config:save']">
                <template #icon><icon-plus /></template>
              </a-button>
            </a-tooltip>

            <a-tooltip content="管理该组配置">
              <a-button shape="round" @click="manageConfigModal" type="primary" v-auth="['setting:config:index']">
                <template #icon><icon-settings /></template>
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
        <a-tab-pane
          v-for="(item, index) in configGroupData"
          :key="`${index}-${item.id}`"
          :title="item.name"
        >
          <ma-form
            v-model="formArray[item.id]"
            :columns="optionsArray[item.id]"
            @onSubmit="submit"
            class="mt-3"
            ref="maFormRef"
          />
        </a-tab-pane>
      </a-tabs>
    </div>

    <div class="ma-content-block p-5 h-full lg:w-1/2 lg:ml-3 mt-3 lg:mt-0" v-if="$common.auth(['setting:config:save'])">
      <add-config @success="addConfigSuccess" />
    </div>

    <a-modal v-model:visible="deleteVisible" type="warning" :on-before-ok="deleteConfigGroup">
      <template #title>危险操作</template>
      <div class="mb-2">
        确定要删除 <span class="text-red-500 underline font-black">{{ deleteGroupData.name }}</span> 配置组吗？
      </div>
      <div>
        此操作会删除组和所属组配置项，如果执行请在下面输入框输入：<span class="text-red-500">{{ deleteGroupData.name }}</span>
      </div>
      <a-input :placeholder="`请输入 ${deleteGroupData.name}`" class="mt-2" v-model="name" />
    </a-modal>

    <add-group ref="addGroupRef" @success="addGroupSuccess" />

    <manage-config ref="manageConfigRef" />
  </div>
</template>

<script setup>
  import { nextTick, ref } from 'vue'
  import config from '@/api/setting/config'
  import { Message } from '@arco-design/web-vue'
  import { auth } from '@/utils/common'
  import AddGroup from './components/addGroup.vue'
  import AddConfig from './components/addConfig.vue'
  import ManageConfig from './components/manageConfig.vue'

  const isCreateNode = ref(false)
  const active = ref('0-1')
  const name = ref('')
  const deleteGroupData = ref({ name: '' })
  const maFormRef = ref()
  const manageConfigRef = ref()
  const addGroupRef = ref()
  const formArray = ref([])
  const optionsArray = ref([])
  const configGroupData = ref([])
  const deleteVisible = ref(false)

  const openDeleteModal = (data) => {
    const id = data.split('-')[1]
    if (id == 1 || id == 2) {
      Message.info('该配置为系统核心配置，无法删除')
      return
    }
    deleteGroupData.value = configGroupData.value.find(item => item.id == id)
    deleteVisible.value = true
  }

  const handleChange = (key) => {
    const params = key.split('-')
    maFormRef.value[params[0]].init()
    active.value = key
  }

  const getConfigGroupList = async () => {
    isCreateNode.value = false
    const response = await config.getConfigGroupList()
    configGroupData.value = response.data
    configGroupData.value.map(async item => {
      formArray.value[item.id] = {}
      optionsArray.value[item.id] = []
      await getConfigData(item.id)
    })
    isCreateNode.value = true
  }

  const getConfigData = async (id) => {
    const params = {
      group_id: id,
      orderBy: 'sort',
      orderType: 'desc'
    }
    const response = await config.getConfigList(params)
    let form = {}
    optionsArray.value[id] = response.data.map(item => {
      let option = { title: item.name, dataIndex: item.key, formType: item.input_type, dict: {}, labelWidth: '120px' }
      const allowDictType = ['select', 'radio', 'checkbox']
      if (allowDictType.includes(item.input_type)) {
        option.dict = { data: item.config_select_data }
      }
      if (item.input_type === 'switch') {
        switch( typeof item.value ) {
          case 'string':
            option.checkedValue = 'true'
            option.uncheckedValue = 'false'
            break
          case 'number':
            option.checkedValue = 1
            option.uncheckedValue = 0
            break
        }
      }
      form[item.key] = item.value
      return option
    })
    formArray.value[id] = form
  }

  const manageConfigModal = () => {
    manageConfigRef.value.open(active.value.split('-')[1])
  }

  const addGroupModal = () => addGroupRef.value.open()
  const addGroupSuccess = (result) => {
    if (result) {
      Message.success('配置组保存成功')
      getConfigGroupList()
      return
    }
    Message.success('配置组保存失败')
  }

  const addConfigSuccess = (result) => {
    if (result) {
      Message.success('配置添加成功')
      getConfigGroupList()
      return
    }
    Message.success('配置添加失败')
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
      getConfigGroupList()
      done(true)
    }
  }

  const submit = async (data) => {
    if (! auth(['setting:config:update'])) {
      Message.info('没有权限修改配置')
    }
    const response = await config.updateByKeys(data)
    if (response.success) {
      Message.success(response.message)
    }
  }

  getConfigGroupList()
  nextTick(() => maFormRef.value && maFormRef.value[0].init() )
</script>
<script>
export default { name: 'setting:config' }
</script>

<style scoped>

</style>
