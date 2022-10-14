<template>
  <template v-for="row in props.columns" :key="row[props.options.pk]">
    <template v-if="!row.hide">
      <a-table-column :title="row.title" v-if="row.children && row.children.length > 0">
        <column
          :options="props.options"
          :columns="row.children"
          :searchRef="props.searchRef"
          :formRef="props.formRef"
          :isRecovery="props.isRecovery"
          :params="props.params"
          @refresh="() => refresh()"
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
        :ellipsis="true"
        :tooltip="row.dataIndex === '__operation' ? false : true"
        :align="row.align || 'left'"
        :fixed="row.fixed"
        :sortable="row.sortable"
        v-else
      >
        <template #cell="{ record, column, rowIndex }">
          <template v-if="row.dataIndex === '__operation'">
            <a-space size="mini">
              <slot name="operationBeforeExtend" v-bind="{ record, column, rowIndex }"></slot>
              <slot name="operationCell" v-bind="{ record, column, rowIndex }">
                <!-- <a-link
                  v-if="
                    props.options.see.show
                    && ($common.auth(props.options.see.auth || [])
                    || (props.options.see.role || []))
                  "
                  type="primary"
                ><icon-eye /> {{ props.options.see.text || '查看' }}</a-link> -->

                <a-link
                  v-if="props.options.edit.show && !props.isRecovery"
                  v-auth="props.options.edit.auth || []"
                  v-role="props.options.edit.role || []"
                  type="primary"
                  @click="editAction(record)"
                >
                  <icon-edit /> {{ props.options.edit.text || '编辑' }}
                </a-link>

                <a-popconfirm
                  content="确定要恢复该数据吗?"
                  position="bottom"
                  @ok="recoveryAction(record)"
                  v-if="props.options.recovery.show && props.isRecovery"
                  v-auth="props.options.recovery.auth || []"
                  v-role="props.options.recovery.role || []"
                >
                  <a-link type="primary"> <icon-undo /> {{ props.options.recovery.text || '恢复' }} </a-link>
                </a-popconfirm>

                <a-popconfirm
                  content="确定要删除该数据吗?"
                  position="bottom"
                  @ok="deleteAction(record)"
                  v-if="props.options.delete.show"
                >
                  <a-link
                    type="primary"
                    v-auth="props.options.delete.auth || []"
                    v-role="props.options.delete.role || []"
                  >
                    <icon-delete />
                    {{
                      props.isRecovery ? props.options.delete.realText || '删除' : props.options.delete.text || '删除'
                    }}
                  </a-link>
                </a-popconfirm>
              </slot>
              <slot name="operationAfterExtend" v-bind="{ record, column, rowIndex }"></slot>
            </a-space>
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
              <a-tag v-if="row.dict.tagColors" :color="getTagColor(row, record)">
                {{ getDataIndex(row, record) }}
              </a-tag>
              <a-tag v-else-if="row.dict.tagColor" :color="row.dict.tagColor">{{ getDataIndex(row, record) }}</a-tag>
              <span v-else>{{ getDataIndex(row, record) }}</span>
            </template>
            <template v-else-if="row.dataIndex && row.dataIndex.indexOf('.') !== -1">
              {{ get(record, row.dataIndex) }}
            </template>
            <template v-else-if="row.formType === 'upload'">
              <a-image
                class="list-image"
                width="40px"
                height="40px"
                :src="fileUrl"
              />
            </template>
            <template v-else>{{ record[row.dataIndex] }}</template>
          </slot>
        </template>
      </a-table-column>
    </template>
  </template>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import config from '@/config/crud'
import { isFunction, get } from 'lodash'
import CustomRender from '../js/custom-render'
import tool from '@/utils/tool'
import commonApi from '@/api/common'

const emit = defineEmits(['refresh'])
const props = defineProps({
  options: Object,
  searchRef: Object,
  formRef: Object,
  columns: Array,
  params: Object,
  isRecovery: Boolean,
})

const getTagColor = (row, record) => {
  return props.searchRef.dictColors( row.dataIndex, (row.dataIndex.indexOf('.') > -1 ) ? get(record, row.dataIndex) : record[row.dataIndex] )
}

const getDataIndex = (row, record) => {
  return props.searchRef.dictTrans( row.dataIndex, (row.dataIndex.indexOf('.') > -1 ) ? get(record, row.dataIndex) : record[row.dataIndex] )
}

const getIndex = rowIndex => {
  const index = rowIndex + 1
  if (props.params[config.request.page] == 1) {
    return index
  } else {
    return (props.params[config.request.page] - 1) * props.params[config.request.pageSize] + index
  }
}

const editAction = record => {
  isFunction(props.options.beforeOpenEdit) && props.options.beforeOpenEdit(record)
  props.formRef.edit(record)
}

const recoveryAction = async record => {
  const response = await props.options.recovery.api({ ids: [record[props.options.pk]] })
  response.code === 200
    ? Message.success(response.message || `恢复成功！`)
    : Message.error(response.message || `恢复失败！`)
  emit('refresh')
}

const deleteAction = async record => {
  if (props.options.beforeDelete && isFunction(props.options.beforeDelete)) {
    props.options.beforeDelete(record)
  }
  const api = props.isRecovery ? props.options.delete.realApi : props.options.delete.api
  const response = await api({ ids: [record[props.options.pk]] })
  if (props.options.afterDelete && isFunction(props.options.afterDelete)) {
    props.options.afterDelete(response, record)
  }
  response.code === 200
    ? Message.success(response.message || `删除成功！`)
    : Message.error(response.message || `删除失败！`)
  emit('refresh')
}

const refresh = () => {
  emit('refresh')
}
</script>

<style scoped>
:deep(.arco-image-img) {
  object-fit: contain;
  background-color: var(--color-fill-4);
}
</style>