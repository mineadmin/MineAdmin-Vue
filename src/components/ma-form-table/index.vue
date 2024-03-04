<template>
    <a-table :data="tableData" v-bind="props.tableConfig" @cell-mouse-enter="handleCellMouseEnter" @cell-mouse-leave="handleCellMouseLeave">
        <template #columns>
            <a-table-column :align="'center'" fixed="left" :width="65" v-if="props.component.formList.length > 0">
                <template #title>
                    <slot name="formTableAdd">
                        <a-button type="primary" shape="circle" size="mini" @click="handleRowAdd()">
                            <icon-plus />
                        </a-button>
                    </slot>
                </template>
                <template #cell="{ record, column, rowIndex }">
                    <a-button status="danger" shape="circle" size="mini" @click="handleRowDel(rowIndex)"
                        v-if="mouseEnterLine == rowIndex && !props.tableConfig.hideButDel">
                        <icon-delete />
                    </a-button>
                    <span v-else>{{ rowIndex + 1 }}</span>
                </template>
            </a-table-column>
            <template v-for="(component, index) in props.component.formList" :key="index">
                <a-table-column :index="index" v-bind="component">
                    <template #cell="{ record, column, rowIndex }">
                        <slot :name="component.dataIndex" v-bind="{ record, column, rowIndex }">
                            <a-typography-text v-bind="component" v-if="component.formType === 'text'">
                                {{ record[column.dataIndex] }}
                            </a-typography-text>
                            <ma-upload v-model="record.image" :type="component.formType" v-bind="component.imageProps"
                                v-else-if="component.formType === 'custom-image'" />
                            <component :is="getComponentName(component?.formType ?? 'input')" v-bind="component"
                                v-model="record[column.dataIndex]" v-else>
                            </component>
                        </slot>
                    </template>
                </a-table-column>
            </template>
        </template>
    </a-table>
</template>
<script setup>
import { ref, computed } from "vue";
const props = defineProps({
    component: { type: Object, default: {} },
    data: { type: Array, default: [] },
    tableConfig: { type: Object, default: {} },
});

//初始化数据
const value = ref(props.data)
//鼠标进入的行数
const mouseEnterLine = ref(undefined);
//数据索引字段名称
const tmpIndexName = "tmpIndex";
//表单数据处理
const tableData = computed(() => {
    if(props.data.length){
        props.data.forEach((item, index) => {
            return item[`${tmpIndexName}`] = index
        })
        return props.data;
    }else{
        return [];
    }
})

/**
 * @title 鼠标移入
 */
const handleCellMouseEnter = (record) => {
    mouseEnterLine.value = record[tmpIndexName];
};

/**
 * @title 鼠标移出
 */
const handleCellMouseLeave = () => {
    mouseEnterLine.value = undefined;
};

/**
 * 新增行
 */
const handleRowAdd = () => {
    let column = Object.fromEntries(
        props.component.formList.map((column) => [column.dataIndex, undefined])
    );
    value.value.push(column)
}

/**
 * 删除行
 */
const handleRowDel = (rowIndex) => {
    value.value.splice(rowIndex, 1)
}

/**
 * @param formType 组件名称
 */
const getComponentName = (formType) => {
    return `a-${formType}`;
};

</script>
<style scoped>
:deep(.arco-input-wrapper) {
    background: none;
    color: #666;
    border-color: var(--color-neutral-3);
}
</style>