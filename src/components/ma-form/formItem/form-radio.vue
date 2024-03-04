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
      <a-radio-group
        v-model="value"
        :size="props.component.size"
        :direction="props.component.direction"
        :type="props.component.type"
        :disabled="props.component.disabled"
        @change="handleCascaderChangeEvent($event)"
      >
        <template v-for="(item, index) in (dictList[dictIndex] ?? [])">
          <a-radio :value="item.value" :disabled="item.disabled" v-if="props.component.styleType == 'card'" class="pl-0">
                    <template #radio="{ checked }">
                        <a-space :align="'start'"
                            class="item-style mb-1 rounded  border-sole border hover:bg-gray-100"
                            :class="{'radio-active': checked}"
                            >
                            <div class="relative w-[120px] h-[60px] flex items-center justify-center transition-all duration-100 ease-in-out ">
                                <div class="text-center">
                                    <div class="font-semibold text-black">{{ item.label }}</div>
                                    <div class="font-normal describe-txt text-gray-500 " v-if="dictData[index].describe ?? false">{{'('+ dictData[index].describe+')'}}</div>
                                </div>
                                <div v-if="checked">
                                    <span class="mark"></span>
                                    <div class="absolute bottom-[-2px] right-[2px] text-white font-system">✓</div>
                                </div>
                            </div>
                        </a-space>
                    </template>
                </a-radio>
          <a-radio :value="item.value" :disabled="item.disabled" v-else>{{ item.label }}</a-radio>
        </template>
      </a-radio-group>
    </slot>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted, nextTick, watch } from 'vue'
import MaFormItem from './form-item.vue'
import { get, set, isUndefined } from 'lodash'
import { runEvent } from '../js/event.js'
import { handlerCascader } from '../js/networkRequest.js'

const props = defineProps({
  component: Object,
  customField: { type: String, default: undefined }
})

const formModel = inject('formModel')
const dictList  = inject('dictList')
const dictData = props.component.dict.data;
const formLoading = inject('formLoading')
const getColumnService= inject('getColumnService')
const columns = inject('columns')
const rv = async (ev, value = undefined) => await runEvent(props.component, ev, { formModel, getColumnService, columns }, value)

const index = props.customField ?? props.component.dataIndex
const dictIndex = index.match(/^(\w+\.)\d+\./) ? index.match(/^(\w+\.)\d+\./)[1] + props.component.dataIndex : props.component.dataIndex
const value = ref(get(formModel.value, index, ''))

watch( () => get(formModel.value, index), vl => value.value = vl )
watch( () => value.value, v => {
  set(formModel.value, index, v)
  index.indexOf('.') > -1 && delete formModel.value[index]
} )

if (value.value === '') {
  value.value = undefined
} else if (! isUndefined(value.value) && props.component.dict && (props.component.dict.name || props.component.dict.data)) {
  value.value = value.value + ''
}

const handleCascaderChangeEvent = async (value) => {
  formLoading.value = true
  const component = props.component
  // 执行自定义事件
  if (component.onChange) {
    rv('onChange', value)
  }
  
  // 处理联动
  if (! index.match(/^(\w+)\.\d+\./)) {
    await handlerCascader(value, component, columns.value, dictList.value, formModel.value)
  }
  nextTick(() => formLoading.value = false)

}

rv('onCreated')
onMounted(() => rv('onMounted'))
</script>
<style scoped>
    .mark{
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0;
        height: 0;
        border-bottom: 26px solid rgb(var(--arcoblue-7));
        border-left: 26px solid transparent;
    }
    .radio-active{
      border-color: rgb(var(--arcoblue-7));
    }
    .item-style:hover{
      border:1px solid rgb(var(--arcoblue-5))
    }
    .describe-txt{
        font-size:smaller
    }
</style>