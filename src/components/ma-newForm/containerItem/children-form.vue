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
    v-show="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :component="props.component"
  > 
    <a-collapse
      :default-active-key="[0]"
      expand-icon-position="right"
      v-if=" (props.component?.type ?? 'group') === 'group' && show"
     :show-expand-icon="false"
    >
      <a-collapse-item v-for="(item, itemIndex) in rows" :key="itemIndex" :header="`子项目 ${itemIndex + 1}`">
        <template #extra>
          <a-space>
            <a-tooltip content="添加新子项">
              <a-button @click.stop="addItem({})" type="primary" size="small" shape="round">
                <template #icon><icon-plus /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip content="删除该子项">
              <a-button
                @click.stop="deleteItem(itemIndex)"
                :disabled="value.length === 1"
                type="primary"
                size="small"
                shape="round"
                status="danger"
              >
                <template #icon><icon-minus /></template>
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
        <template v-for="(component, componentIndex) in item" :key="componentIndex">
          <component
            v-if="! containerItems.includes(component.formType)"
            :is="getComponentName(component?.formType ?? 'input')"
            :component="component"
          >
            <template v-for="slot in Object.keys($slots)" #[slot]="component">
              <slot :name="slot" v-bind="component" />
            </template>
          </component>
        </template>
      </a-collapse-item>
    </a-collapse>

    <a-table v-else class="w-full" :data="rows" :pagination="false" bordered stripe>
      <template #columns>
        <!-- 新增、删除列 -->
        <a-table-column :width="50" fixed="left">
          <template #title>
            <a-button type="primary" @click="addItem({})" size="small" shape="round">
              <template #icon>
                <icon-plus />
              </template>
            </a-button>
          </template>
          <template #cell="{ rowIndex }">
            <a-button type="primary"
              status="danger"
              size="small"
              shape="round"
              :disabled="value.length === 1"
              @click="deleteItem(rowIndex)"
            >
              <template #icon><icon-minus /></template>
            </a-button>
          </template>
        </a-table-column>

        <template v-for="(component, itemIndex) in formList" :key="itemIndex">
          <a-table-column
            :width="component.width ?? 100"
            :title="component.title ?? ''"
            :align="component.align || 'left'"
            :fixed="component.fixed"
          >
            <template #cell="{ rowIndex }">
              <component
                v-if="! containerItems.includes(rows[rowIndex][itemIndex].formType)"
                :is="getComponentName(rows[rowIndex][itemIndex].formType ?? 'input')"
                :component="rows[rowIndex][itemIndex]"
              >
                <template v-for="slot in Object.keys($slots)" #[slot]="component">
                  <slot :name="slot" v-bind="component" />
                </template>
              </component>
            </template>
          </a-table-column>
        </template>
      </template>
    </a-table>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, provide, onMounted, watch, nextTick } from 'vue'
import { get, set } from 'lodash'
import { getComponentName, containerItems } from '../js/utils.js'
import MaFormItem from '../formitem/form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
import { arrayComponentDefault, loadDict, handlerCascader } from '../js/networkRequest.js'

const props = defineProps({ component: Object })
const formList = props.component.formList
const rows = ref([])
const show = ref(true)
const formModel = inject('formModel')
const columns = inject('columns')
const dictList = inject('dictList')
const value = ref(get(formModel, props.component.dataIndex, []))

provide('childrenFormList', props.component.formList)

const addItem = async (data = {}, type = 'new') => {
  const index = rows.value.length
  const form = []
  await formList.map(async item => {
    const tmp = JSON.parse(JSON.stringify(item))
    tmp['hideLabel'] = props.component.type === 'table' ? true : false
    tmp['source'] = item.dataIndex
    tmp['dataIndex'] = getChildrenDataIndex(index, tmp.dataIndex)
    form.push(tmp)
    item.dict && await loadDict(dictList, tmp)
  })
  form.map(async item => {
    await handlerCascader( get(formModel, item.dataIndex), item, form, dictList, formModel, false )
  })
  rows.value.push(form)
  type == 'new' && value.value.push(data)
  maEvent.handleCommonEvent(props.component, 'onAdd')
}

const deleteItem = async (index) => {
  if (value.value.length > 1) {
    rows.value = []
    await value.value.splice(index, 1)
    value.value.map(async item => { await addItem(item, 'viewData') })
    maEvent.handleCommonEvent(props.component, 'onDelete')
  }
}

watch(
  () => value.value, v => {
    formModel[props.component.dataIndex] = v
  }, { deep: true }
)

const getChildrenDataIndex = (index, dataIndex) => {
  return [ props.component.dataIndex, index, dataIndex ].join('.')
}

maEvent.handleCommonEvent(props.component, 'onCreated')

onMounted(async () => {
  value.value.map(async item => { await addItem(item, 'viewData') })
  if (value.value.length === 0) {
    for (let i = 0; i < (props.component.emptyRow ?? 1); i++) {
      await addItem()
    }
  }
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>

<style scoped>
:deep(.arco-form-item-content-flex) {
  display: block;
}
:deep(.arco-table-cell .arco-form-item) {
  margin-bottom: 0;
}
</style>