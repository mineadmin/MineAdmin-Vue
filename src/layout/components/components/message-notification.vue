<template>
  <div class="mgs-nfc rounded p-2 shadow-lg">
    <a-tabs default-active-key="message" type="rounded">
      <a-tab-pane key="message">
        <template #title>
          {{ $t('sys.operationMessage.message') }}
          <a-badge
            :count="5"
            dot
            :dotStyle="{ width: '5px', height: '5px', top: '-8px' }"
            v-if="messageStore.messageList.length > 0"
          > </a-badge>
        </template>
        <a-list :max-height="230" class="h-full" v-if="messageStore.messageList.length > 0">
          <a-list-item
            v-for="item in messageStore.messageList" :key="item.id" class="cursor-pointer"
            @click="viewMessage(item)"
          >
            <a-list-item-meta :title="item.title">
              <template #description>
                <div class="flex justify-between" style="font-size: 13px;">
                  <span>发送人：{{item.send_user.nickname}}</span>
                  <span>时间：{{item.created_at.substr(0, 10)}}</span>
                </div>
              </template>
              <template #avatar>
                <a-avatar shape="square">
                  <img alt="avatar" :src="`${item.send_user.avatar ? item.send_user.avatar : '/avatar.jpg'}`" />
                </a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
        <a-empty v-else class="h-full" />
      </a-tab-pane>
      <a-tab-pane key="todo">
        <template #title>{{ $t('sys.operationMessage.todo') }}</template>
        <a-empty class="h-full" />
      </a-tab-pane>
    </a-tabs>
  </div>

  <a-modal v-model:visible="detailVisible" fullscreen :footer="false">
    <template #title>消息详情</template>
    <a-typography :style="{ marginTop: '-30px' }">
      <a-typography-title class="text-center">
        {{ row?.title }}
      </a-typography-title>
      <a-typography-paragraph class="text-right" style="font-size: 13px; color: var(--color-text-3)">
        <a-space size="large">
          <span>创建时间：{{ row?.created_at }}</span>
        </a-space>
      </a-typography-paragraph>
      <a-typography-paragraph>
        <div v-html="row?.content" ></div>
      </a-typography-paragraph>
    </a-typography>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { useMessageStore } from '@/store'
import queueMessage from '@/api/system/queueMessage'
const messageStore = useMessageStore()

const row = ref({})
const detailVisible = ref(false)

const viewMessage = async (record) => {
  row.value = record
  await queueMessage.updateReadStatus({ ids: [record.id] })
  messageStore.messageList.find( (item, idx) => {
    if (item && record.id == item.id) messageStore.messageList.splice(idx, 1)
  })
  detailVisible.value = true
}

</script>

<style scoped lang="less">
.mgs-nfc {
  width: 400px;
  background: var(--color-bg-1);
  height: 360px;
  border: 1px solid var(--color-border-1);
  margin-right: 10px;
  margin-top: 9px;
  position: relative;
}
:deep(.arco-list-item-meta-content)
{
  width: 100%;
}
</style>