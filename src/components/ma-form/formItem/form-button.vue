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
  <div>
    <slot :name="`form-${props.component.dataIndex}`" v-bind="props.component">
      <a-button
        :type="props.component.type"
        :status="props.component.status"
        :size="props.component.size"
        :shape="props.component.shape"
        :disabled="props.component.disabled"
        :long="props.component.long"
        :loading="props.component.loading"
        :html-type="props.component.htmlType"
        :href="props.component.href"
        @click="rv('onClick')"
      >
        <template #icon v-if="props.component.icon">
          <component :is="props.component.icon" />
        </template>
        {{ props.component.title ?? 'button' }}
      </a-button>
    </slot>
  </div>
</template>
  
<script setup>
import { onMounted, inject } from 'vue'
import { runEvent } from '../js/event.js'
const props = defineProps({
  component: Object,
})

const formModel = inject('formModel')
const getColumnService= inject('getColumnService')
const columns = inject('columns')
const rv = async (ev, value = undefined) => await runEvent(props.component, ev, { formModel, getColumnService, columns }, value)

rv('onCreated')
onMounted(() => rv('onMounted') )
</script>