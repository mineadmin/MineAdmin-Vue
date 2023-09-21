<template>
  <template v-for="row in props.columns" :key="row[options.pk]">
    <template v-if="isFunction(row.hide) ? row.hide() : !row.hide">
      <a-table-column
          :title="row.title"
          :width="row.width"
          :ellipsis="row.ellipsis ?? true"
          :filterable="row.filterable"
          :cell-class="row.cellClass"
          :header-cell-class="row.headerCellClass"
          :body-cell-class="row.bodyCellClass"
          :summary-cell-class="row.summaryCellClass"
          :cell-style="row.cellStyle"
          :header-cell-style="row.headerCellStyle"
          :body-cell-style="row.bodyCellStyle"
          :summary-cell-style="row.summaryCellStyle"
          :tooltip="row.tooltip ?? true"
          :align="row.align || 'left'"
          :fixed="row.fixed"
          v-if="row.children && row.children.length > 0"
      >
        <column
            @refresh="() => refresh()"
            :isRecovery="props.isRecovery"
            :crudFormRef="props.crudFormRef"
            :columns="row.children"
        >
          <template
              v-for="(childRow, childIndex) in row.children"
              :key="childIndex"
              #[childRow.dataIndex]="{ record, column, rowIndex }"
          >
            <slot :name="`${childRow.dataIndex}`" v-bind="{ record, column, rowIndex }" />
          </template>
        </column>
      </a-table-column>
      <a-table-column
          :title="row.title"
          :data-index="row.dataIndex"
          :width="row.width"
          :ellipsis="row.ellipsis ?? true"
          :filterable="row.filterable"
          :cell-class="row.cellClass"
          :header-cell-class="row.headerCellClass"
          :body-cell-class="row.bodyCellClass"
          :summary-cell-class="row.summaryCellClass"
          :cell-style="row.cellStyle"
          :header-cell-style="row.headerCellStyle"
          :body-cell-style="row.bodyCellStyle"
          :summary-cell-style="row.summaryCellStyle"
          :tooltip="row.dataIndex === '__operation' ? false : (row.tooltip ?? true)"
          :align="row.align || 'left'"
          :fixed="row.fixed"
          :sortable="row.sortable"
          v-else
      >
        <template #cell="{ record, column, rowIndex }">
          <!-- 操作栏 -->
          <template v-if="row.dataIndex === '__operation'">
            <a-scrollbar type="track" style="overflow: auto;">
              <a-space size="mini">
                <slot name="operationBeforeExtend" v-bind="{ record, column, rowIndex }"></slot>
                <slot name="operationCell" v-bind="{ record, column, rowIndex }">
                  <!-- <a-link
                    v-if="
                      options.see.show
                      && ($common.auth(options.see.auth || [])
                      || (options.see.role || []))
                    "
                    type="primary"
                  ><icon-eye /> {{ options.see.text || '查看' }}</a-link> -->
                  <a-link
                      v-if="(isFunction(options.edit.show) ? options.edit.show(record) : options.edit.show) && !props.isRecovery"
                      v-auth="options.edit.auth || []"
                      v-role="options.edit.role || []"
                      type="primary"
                      :disabled="(isFunction(options.edit.disabled) ? options.edit.disabled(record) : options.edit.disabled)"
                      @click="editAction(record)"
                  >
                    <icon-edit /> {{ options.edit.text || '编辑' }}
                  </a-link>

                  <a-popconfirm
                      content="确定要恢复该数据吗?"
                      position="bottom"
                      @ok="recoveryAction(record)"
                      v-if="(isFunction(options.recovery.show) ? options.recovery.show(record):options.recovery.show) && props.isRecovery"
                      v-auth="options.recovery.auth || []"
                      v-role="options.recovery.role || []"
                  >
                    <a-link type="primary"><icon-undo /> {{ options.recovery.text || '恢复' }} </a-link>
                  </a-popconfirm>

                  <a-popconfirm
                      content="确定要删除该数据吗?"
                      position="bottom"
                      @ok="deleteAction(record)"
                      v-if="(isFunction(options.delete.show) ? options.delete.show(record) : options.delete.show)"
                  >
                    <a-link
                        type="primary"
                        v-auth="options.delete.auth || []"
                        v-role="options.delete.role || []"
                        :disabled="(isFunction(options.delete.disabled) ? options.delete.disabled(record) : options.delete.disabled)"
                    >
                      <icon-delete />
                      {{
                        props.isRecovery ? options.delete.realText || '删除' : options.delete.text || '删除'
                      }}
                    </a-link>
                  </a-popconfirm>
                </slot>
                <slot name="operationAfterExtend" v-bind="{ record, column, rowIndex }"></slot>
              </a-space>
            </a-scrollbar>
          </template>
          <template v-else-if="row.customRender">
            <custom-render
                :column="column"
                :record="record"
                :render="row.customRender"
                :rowIndex="rowIndex"
            ></custom-render>
          </template>
          <slot :name="row.dataIndex" v-bind="{ record, column, rowIndex }" v-else>
            <template v-if="row.dataIndex === '__index'">{{ getIndex(rowIndex) }}</template>

            <template v-if="row.dict && row.dict.translation">
              <template v-if="isArray(get(record, row.dataIndex))">
                <a-tag v-for="item in get(record, row.dataIndex)" class="ml-1">{{ getDataIndex(row, item) }}</a-tag>
              </template>
              <a-tag v-else-if="row.dict.tagColors" :color="getTagColor(row, record)">
                {{ getDataIndex(row, record) }}
              </a-tag>
              <a-tag v-else-if="row.dict.tagColor" :color="row.dict.tagColor">{{ getDataIndex(row, record) }}</a-tag>
              <span v-else>{{ getDataIndex(row, record) }}</span>
            </template>
            <template v-else-if="row.dataIndex && row.dataIndex.indexOf('.') !== -1">
              {{ get(record, row.dataIndex) }}
            </template>
            <template v-else-if="row.formType === 'upload'">
              <a-link @click="imageSee(row, record, row.dataIndex)"><icon-image /> 查看图片</a-link>
            </template>
            <template v-else>{{ record[row.dataIndex] }}</template>
          </slot>
        </template>
      </a-table-column>
    </template>
  </template>
</template>

<script setup>
import { inject } from 'vue'
import config from '@/config/crud'
import uploadConfig from '@/config/upload'
import { Message } from '@arco-design/web-vue'
import { isFunction, get, isArray, isObject } from 'lodash'
import CustomRender from '../js/custom-render'
import tool from '@/utils/tool'
import commonApi from '@/api/common'

const emit = defineEmits(['refresh', 'showImage'])
const props = defineProps({
  columns: Array,
  isRecovery: Boolean,
  crudFormRef: Object
})

const options = inject('options')
const requestParams = inject('requestParams')
const dictTrans = inject('dictTrans')
const dictColors = inject('dictColors')

const imageSee = async (row, record, dataIndex) => {
  if (row.returnType) {

    if (row.returnType === 'url') {
      emit('showImage', record[dataIndex])
      return
    }

    if (row.returnType === 'hash') {
      emit('showImage', tool.showFile(record[dataIndex]))
      return
    }

    if (row.returnType === 'id') {
      Message.info('该图片无法查看')
      return
    }

  } else {
    if (! record[row.dataIndex]) {
      Message.info('无图片')
      return
    }
    emit('showImage', record[row.dataIndex] ?? 'not-image.png')
  }
}

const getTagColor = (row, record) => {
  return dictColors( row.dataIndex, (row.dataIndex.indexOf('.') > -1 ) ? get(record, row.dataIndex) : record[row.dataIndex] )
}

const getDataIndex = (row, record) => {
  if (isObject(record)) {
    return dictTrans( row.dataIndex, (row.dataIndex.indexOf('.') > -1 ) ? get(record, row.dataIndex) : record[row.dataIndex] )
  }else{
    return dictTrans( row.dataIndex, record)
  }
}

const getIndex = rowIndex => {
  const index = rowIndex + 1
  if (requestParams[config.request.page] === 1) {
    return index
  } else {
    return (requestParams[config.request.page] - 1) * requestParams[config.request.pageSize] + index
  }
}

const editAction = record => {
  if (isFunction(options.beforeOpenEdit) && ! options.beforeOpenEdit(record)) {
    return false
  }
  if (options.edit.action && isFunction(options.edit.action)) {
    options.edit.action(record)
  } else {
    props.crudFormRef.edit(record)
  }
}

const recoveryAction = async record => {
  const response = await options.recovery.api({ ids: [record[options.pk]] })
  response.success && Message.success(response.message || `恢复成功！`)
  emit('refresh')
}

const deleteAction = async record => {
  let data = {}
  if (isFunction(options.beforeDelete) && !( data = options.beforeDelete([ record[options.pk] ])) ) {
    return false
  }
  const api = props.isRecovery ? options.delete.realApi : options.delete.api
  const response = await api(Object.assign({ ids: [record[options.pk]] }, data))
  if (options.afterDelete && isFunction(options.afterDelete)) {
    options.afterDelete(response, record)
  }
  response.success && Message.success(response.message || `删除成功！`)
  emit('refresh')
}

const refresh = () => {
  emit('refresh')
}

defineExpose({ deleteAction, recoveryAction })
</script>

<style scoped>
:deep(.arco-image-img) {
  object-fit: contain;
  background-color: var(--color-fill-4);
}
</style>