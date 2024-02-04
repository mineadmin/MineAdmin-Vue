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
  <ma-form-item
    v-if="(typeof props.component.display == 'undefined' || props.component.display === true)"
    :component="props.component"
    :custom-field="props.customField"
  >
    <slot :name="`form-${props.component.dataIndex}`" v-bind="props.component">
      <a-table class="w-full" row-key="keys" :pagination="false" @change="handleChange" :data="value" :draggable="{ type: 'handle', width: 40 }">
        <template #columns>
          <a-table-column title="Key" align="center">
            <template #cell="{ record }">
              <a-input v-model="record.key" />
            </template>
          </a-table-column>
          <a-table-column title="Value" align="center">
            <template #cell="{ record }">
              <a-input v-model="record.value" />
            </template>
          </a-table-column>
          <a-table-column title="操作" align="center">
            <template #cell="{ rowIndex }">
              <a-space>
                <a-button size="small" type="primary" @click="plus(rowIndex)"><template #icon><icon-plus /></template></a-button>
                <a-button size="small" type="primary" @click="minus(rowIndex)"><template #icon><icon-minus /></template></a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </slot>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue'
import { get, set, cloneDeep, isArray } from 'lodash'
import MaFormItem from './form-item.vue'
import { runEvent } from '../js/event.js'
import { Message } from '@arco-design/web-vue'

const props = defineProps({
  component: Object,
  customField: { type: String, default: undefined }
})

const formModel = inject('formModel')
const getColumnService= inject('getColumnService')
const columns = inject('columns')
const dictList  = inject('dictList')
const rv = async (ev, value = undefined) => await runEvent(props.component, ev, { formModel, getColumnService, columns }, value)
const index = props.customField ?? props.component.dataIndex
const dictIndex = index.match(/^(\w+\.)\d+\./) ? index.match(/^(\w+\.)\d+\./)[1] + props.component.dataIndex : props.component.dataIndex
const value = ref(get(formModel.value, index))

watch( () => get(formModel.value, index), vl => value.value = vl )
watch( () => value.value, v => {
  set(formModel.value, index, v)
  index.indexOf('.') > -1 && delete formModel.value[index]
} )

if (! isArray(value.value) || value.value.length === 0) {
  value.value = [{ key: '', value: ''}]
}

const handleChange = (data) => {
  value.value = data
}

const plus = (index) => {
  value.value.splice(index + 1, 0, { key: '', value: '' })
}

const minus = (index) => {
  if (value.value.length === 1) {
    Message.info('最少要保留一个')
    return false
  }
  const data = cloneDeep(value.value)
  data.splice(index, 1)
  value.value = cloneDeep(data)
}

rv('onCreated')
onMounted(() => rv('onMounted'))
</script>