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
  <div class="ma-content-block p-3 lg:h-full block lg:border-0 lg:flex justify-between">
    <ul class="w-full lg:w-52 msg-menu p-2 shadow" ref="msgMenuRef">
      <li
        v-for="(item, index) in msgType"
        :key="item"
        @click="getMessageList(item.key, index)"
      >
        <Component :is="typeIcon[item.key] ? typeIcon[item.key] : 'icon-message'" /> 
        <span class="pl-3">{{ item.title }}</span></li>
    </ul>
    <div class="h-hull w-full lg:ml-3 lg:mr-2 pt-2">
      <ma-crud :options="crud" :columns="columns" ref="crudRef">

        <template #tableAfterButtons>
          <a-radio-group
            class="mt-2 lg:mt-0"
            type="button"
            default-value="all"
            @change="changeReadStatus" v-if="currentKey !== 'send_box'">
            <a-radio value="all">全部</a-radio>
            <a-radio value="1">未读</a-radio>
            <a-radio value="2">已读</a-radio>
          </a-radio-group>
        </template>

        <template #operationBeforeExtend="{ record }">
          <a-link
            @click="showReceiveList(record.id)"
            v-if="currentKey === 'send_box'"
          >
            <icon-user-group /> 接收用户
          </a-link>

          <a-link @click="showDetail(record)">
            <icon-eye /> 详细
          </a-link>
        </template>
      </ma-crud>
    </div>

    <a-drawer v-model:visible="detailVisible" width="1000px" :footer="false">
      <template #title>消息详情</template>
      <a-spin :loading="detailLoading" tip="数据加载中..." class="block">
        <a-typography :style="{ marginTop: '-30px' }">
          <a-typography-title>
            {{ record?.title }}
          </a-typography-title>
          <a-typography-paragraph class="text-right" style="font-size: 13px; color: var(--color-text-3)">
            <a-space size="large">
              <span>创建时间：{{ record?.created_at }}</span>
            </a-space>
          </a-typography-paragraph>
          <a-typography-paragraph>
            <div v-html="record?.content" ></div>
          </a-typography-paragraph>
        </a-typography>
      </a-spin>
    </a-drawer>

    <a-modal v-model:visible="receiveListVisible" width="1000px">
      <template #title>接收用户列表</template>
      <ma-crud :options="receiveCrud" :columns="receiveColumns" ref="receiveCrudRef" />
    </a-modal>
  </div>

</template>
<script setup>
  import { nextTick, onMounted, ref } from 'vue'
  import commonApi from '@/api/common'
  import queueMessage from '@/api/system/queueMessage'

  const typeIcon = ref({
    send_box: 'icon-send',
    receive_box: 'icon-email',
    carbon_copy_mine: 'icon-copy',
    todo: 'icon-calendar',
    announcement: 'icon-mobile',
    notice: 'icon-notification',
    private_message : 'icon-message',
  })

  const msgType = ref([])
  const msgMenuRef = ref()
  const crudRef = ref()
  const receiveCrudRef = ref()
  const currentKey = ref()
  const detailVisible = ref(false)
  const detailLoading = ref(true)
  const receiveListVisible = ref(false)
  const record = ref({})
  
  onMounted(async () => {
    const response = await commonApi.getDict('queue_msg_type')
    msgType.value = response.data
    msgType.value.unshift(...[
      { key: 'receive_box', title: '收件箱' }, { key: 'send_box', title: '已发送' }
    ])
    await getMessageList('receive_box', 0)
  })

  const getMessageList = async (key, index) => {
    nextTick(() => {
      const children = msgMenuRef.value.children
      if (children && children[index].className.indexOf('active') === -1) {
        for ( let i = 0; i < children.length; i++) children[i].className = ''
        children[index].className = 'active'
        if (! ['send_box', 'receive_box'].includes(key)) {
          crud.value.requestParams.content_type = key
        } else {
          crud.value.requestParams.content_type = 'all'
        }
        currentKey.value = key
        loadData(key)
      } else {
        return
      }
    })
  }

  const loadData = (key) => {
    crud.value.api = key === 'send_box' ? queueMessage.getSendList : queueMessage.getReceiveList
    const sendBy = { title: '发送人', dataIndex: 'send_user.nickname', width: 120, addDisplay: false, editDisplay: false  }
    if (key === 'send_box' && columns.value[0].title === '发送人') {
      columns.value.splice(0, 1)
    } else if (key !== 'send_box' && columns.value[0].title !== '发送人') {
      columns.value.unshift(sendBy)
    }
    nextTick(() => crudRef.value.requestData())
  }

  const changeReadStatus = (key) => {
    crud.value.requestParams.read_status = key
    crudRef.value.requestData()
  }

  const showDetail = async(row) => {
    detailVisible.value = true
    detailLoading.value = true
    await queueMessage.updateReadStatus({ ids: row.id })
    record.value = row
    detailLoading.value = false
  }

  const showReceiveList = (id) => {
    receiveListVisible.value = true
    receiveCrud.value.requestParams.id = id
    receiveCrudRef.value.requestData()
  }

  const receiveCrud = ref({
    api: queueMessage.getReceiveUser,
    requestParams: {},
    autoRequest: false
  })

  const receiveColumns = ref([
    { title: '用户名', dataIndex: 'username' },
    { title: '昵称', dataIndex: 'nickname' },
    { title: '查看状态', dataIndex: 'read_status' }
  ])

  const crud = ref({
    autoRequest: false,
    showIndex: false,
    requestParams: { read_status: 'all' },
    rowSelection: { showCheckedAll: true },
    add: { show: true, text: '发私信', api: queueMessage.sendPrivateMessage },
    delete: { show: true, api: queueMessage.deletes },
    operationColumn: true,
    operationWidth: 240,
    formOption: { width: 800 },
    api: () => {}
  })

  const columns = ref([
    {
      title: '消息标题',
      dataIndex: 'title',
      search: true,
      commonRules: [{
        required: true,
        message: '消息标题必填',
      }],
      validateTrigger: 'blur',
    },
    {
      title: '消息类型',
      dataIndex: 'content_type',
      formType: 'select',
      width: 150,
      dict: { name: 'queue_msg_type', translation: true, props: { label: 'title', value: 'key' } },
      addDisplay: false, editDisplay: false 
    },
    {
      title: '接收用户',
      dataIndex: 'users',
      formType: 'user-select',
      isEcho: true,
      commonRules: [{
        required: true,
        message: '请选择接收用户',
      }],
      hide: true,
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      formType: 'editor',
      hide: true,
    },
    {
      title: '发送时间',
      dataIndex: 'created_at',
      width: 180,
      search: true,
      formType: 'range',
      addDisplay: false,
      editDisplay: false 
    },
  ])
</script>
<script>
export default { name: 'message' }
</script>

<style scoped lang="less">
.msg-menu{
  // border-right: 1px solid var(--color-border-2);
  & li {
    border-radius: 3px; cursor: pointer; margin-bottom: 5px;
    padding: 10px; padding-left: 20px;
  }
  & li:hover, & li.active {
    background: var(--color-fill-2);
    color: rgb(var(--primary-5));
  }
}
</style>