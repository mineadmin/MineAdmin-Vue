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
  <div class="ma-content-block p-1 block lg:flex justify-between">
    <ul class="w-full lg:w-52 msg-menu lg:border-r h-full p-2" ref="msgMenuRef">
      <li
        v-for="(item, index) in msgType"
        :key="item"
        @click="getMessageList(item.key, index)"
        :class="item.title == '收件箱' ? 'active' : ''"
      >
        <Component :is="typeIcon[item.key] ? typeIcon[item.key] : 'icon-message'" /> 
        <span class="pl-3">{{ item.title }}</span></li>
    </ul>
    <div class="h-hull w-full lg:ml-2 lg:mr-1">
      <ma-crud :crud="crud" :columns="columns" ref="crudRef" />
    </div>
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
  
  onMounted(async () => {
    const response = await commonApi.getDict('queue_msg_type')
    msgType.value = response.data
    msgType.value.unshift(...[
      { key: 'receive_box', title: '收件箱' }, { key: 'send_box', title: '已发送' }
    ])
    await getMessageList('receive_box', 0)
  })

  const getMessageList = (key, index) => {
    nextTick(() => {
      const children = msgMenuRef.value.children
      if (children && children[index].className.indexOf('active') === -1) {
        for ( let i = 0; i < children.length; i++) children[i].className = ''
        children[index].className = 'active'
        loadData(key)
      } else {
        return
      }
    })
  }

  const loadData = (key) => {
    crud.value.api = key === 'send_box' ? queueMessage.getSendList : queueMessage.getReceiveList
    crudRef.value.requestData()
  }

  const crud = ref({
    autoRequest: false,
    api: () => {}
  })

  const columns = ref([])


</script>

<style scoped lang="scss">
.msg-menu{
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