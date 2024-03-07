<template>
    <div class="w-full">
        <a-table :data="tableData" @cell-mouse-enter="handleCellMouseEnter" @cell-mouse-leave="handleCellMouseLeave"
            v-bind="tableConfig" @change="handleChange">
            <template #columns>
                <a-table-column :align="'center'" fixed="left" :width="65" v-if="columns.length > 0">
                    <template #title>
                        <a-button type="primary" shape="circle" size="mini" @click="handleAdd()">
                            <icon-plus />
                        </a-button>
                    </template>
                    <template #cell="{ record, column, rowIndex }">
                        <a-button status="danger" shape="circle" size="mini" @click="handleRowDel(rowIndex)"
                            v-if="mouseEnterLine == rowIndex && !props.component.hideButDel">
                            <icon-delete />
                        </a-button>
                        <span v-else>{{ rowIndex + 1 }}</span>
                    </template>
                </a-table-column>
                <template v-for="(component, index) in columns" :key="index">
                    <a-table-column :index="index" v-bind="component">
                        <template #cell="{ record, column, rowIndex }">
                            <a-typography-text v-bind="component" v-if="component.formType === 'text'">
                                {{ record[column.dataIndex] }}
                            </a-typography-text>
                            <template v-else-if="component.formType === 'grid-input'">
                                <a-grid :cols="{ xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4 }" :colGap="12" :rowGap="12">
                                    <a-grid-item v-for="(item, itemIndex) in record[column.dataIndex]" :key="itemIndex">
                                      <a-space class="border p-2">
                                            <a-input v-model="record[column.dataIndex][itemIndex]"
                                                :placeholder="'请输入' + component.title"
                                                @change="checkItemRepeat($event, record[column.dataIndex], itemIndex)"></a-input>
                                            <a-link
                                                @click="handleItemDel(rowIndex, column, itemIndex)"><icon-delete /></a-link>
                                        </a-space>
                                        <div class="w-[228px]" v-if="rowIndex == 0">
                                            <ma-upload class="mt-1" v-model="specImages[itemIndex]" fit="contain"
                                                :width="228" :height="80" :center="true" :onlyUrl="true" returnType="url"
                                                type="custom-image"></ma-upload>
                                        </div>
                                    </a-grid-item>
                                    <a-grid-item>
                                        <a-space class="border p-2">
                                            <a-input v-model="children[rowIndex]" :placeholder="'新增' + component.title" />
                                            <a-button type="primary" size="mini"
                                                :disabled="children[rowIndex]?false:true"
                                                @click="handleAddItem(record, column.dataIndex, rowIndex)">
                                                <template #icon>
                                                    <icon-plus />
                                                </template>
                                            </a-button>
                                        </a-space>
                                    </a-grid-item>
                                </a-grid>
                            </template>
                            <component :is="getComponentName(component?.formType ?? 'input')" v-bind="component"
                                v-model="record[column.dataIndex]" v-else>
                            </component>
                        </template>
                    </a-table-column>
                </template>
            </template>
        </a-table>
        <div class="box-border border border-e5e6eb border-solid border-t-0 p-4" v-if="value">
            <a-button type="outline" size="small" @click="buildProperties">
                <template #default>生成属性</template>
            </a-button>
        </div>
        <div class="mt-3">
            <component :key="componentIndex" :is="attributeTable" v-bind="attrProps"/>
        </div>
    </div>
</template>
<script setup>
import { ref,reactive, provide,inject,computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import attributeTable from './attribute.vue'
import { get, set } from 'lodash'
// 组件都需要定义以下的props
const props = defineProps({
    component: Object,
    customField: { type: String, default: undefined }
})
// 规格名
const specName = ref("spec_name")
// 规格值
const specValue = ref("spec_value")
provide("specModel",{specName:specName.value, specValue:specValue.value})
// 规格字段
const columns = reactive([
    {
        title: '规格名称',
        dataIndex: `${specName.value}`,
        formType: 'input',
        placeholder: '请输入规格名称',
        width: 220
    },
    {
        title: '规格值',
        dataIndex: `${specValue.value}`,
        formType: 'grid-input'
    }
])

// 表属性配置
const tableConfig = ref({
    scroll: { x: '100%', y: '100%' },
    scrollbar: true, //表格的滚动属性配置。
    draggable: { //表格拖拽排序的配置 TableDraggable
        type: 'handle',
        fixed: true,
    },
    pagination: false,
    tableLayoutFixed: true,//表格的 table-layout 属性设置为 fixed，设置为 fixed 后，表格的宽度不会被内容撑开超出 100%。
    bordered: { headerCell: true, bodyCell: true, wrapper: true }//是否显示边框 boolean | TableBorder
})
//鼠标进入的行数
const mouseEnterLine = ref(undefined);
//数据索引字段名称
const tmpIndexName = "tmpIndex";
//表单数据
const formModel = inject('formModel')
//表单字段名称
const index = props.customField ?? props.component.dataIndex
//表单数据
const value = ref(get(formModel.value, index))
//规格组图片
const specImages = ref([])
//新增子项数据：为了更通用不写死原则
const children = ref([])
//表单数据处理
const tableData = computed(() => {
    if (!value.value) return ([]);
    //为什么要增加这个字段因为arco.design鼠标进入行或离开行的时候没有返回行号“脑壳疼”
    value.value.forEach((item, index) => {
        return item[`${tmpIndexName}`] = index
    })
    return value.value
});

// 组件索引
const componentIndex = ref(0)
// 属性表数据
const attrProps = ref({
    specData:[],
    attrData:[
        {
            price: 300.00,
            cost_price: 0.00,
            plain_price: 679.00, 
        }
    ]
})

/**
 * @param formType 组件名称 ：注意！！！仅支持 arco.design 组件
 */
const getComponentName = (formType) => {
    return `a-${formType}`;
};

/**
 * 新增行
 */
const handleAdd = () => {
    let column = Object.fromEntries(
        columns.map((column) => [column.dataIndex, undefined])
    );
    value.value.push(column)
}

/**
 * 新增子项
 */
const handleAddItem = (record, dataIndex, rowIndex) => {
    if (!children.value[rowIndex]) return
    if (!record[dataIndex]) {
        record[dataIndex] = [children.value[rowIndex]];
    } else {
        if (record[dataIndex].includes(children.value[rowIndex])) {
            children.value[rowIndex] = undefined
            Message.error("新增的规格值已存在")
        } else {
            record[dataIndex].push(children.value[rowIndex])
        }
    }
    children.value[rowIndex] = undefined
}

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
 * 检测规格子项是否存在重复
 */
const checkItemRepeat = (record, item, itemIndex) => {
    let filteredArray = item.filter((_, index) => index !== itemIndex);
    if (filteredArray.includes(record)) {
        item[itemIndex] = undefined;
    }
}

/**
 * 删除规格子项
 */
const handleItemDel = (rowIndex, column, itemIndex) => {
    value.value[rowIndex][column.dataIndex].splice(itemIndex, 1)
}

/**
 * 删除行
 */
const handleRowDel = (rowIndex) => {
    value.value.splice(rowIndex, 1)
}

/**
 * 表格数据发生变化时触发
 */
const handleChange = (data)=>{
    value.value = data
}

/**
 * 从数组中删除不满足条件的对象  
 */
function removeInvalidSpecs(specData) {  
    return specData.filter(spec => {  
        return spec[specName.value] !== undefined && spec[specName.value] !== '' &&  
            Array.isArray(spec[specValue.value]) && spec[specValue.value].length > 0;  
    });  
}  


/**
 * 生成属性
 */
const buildProperties = () => {
    let specData = value.value;
    attrProps.value.specData = removeInvalidSpecs(specData);
    componentIndex.value +=1;
}
</script>
<style scoped>
    :deep(.arco-input-wrapper) {
        background: none;
        color: #666;
        border-color: var(--color-neutral-3);
    }
</style>