<template>
    <ma-form-table :data="tableData" :table-config="tableConfig" :component="{ formList: tableColumns }">
        <template #formTableAdd>
            <a-popover position="rt" trigger="click">
                <a-button type="primary" shape="circle" size="mini" :disabled="specData.length ? false : true">
                    <icon-settings />
                </a-button>
                <template #content>
                    <attribute-batch :specList="props.specData" :columns="tableColumnsBase"/>
                </template>
            </a-popover>
        </template>
    </ma-form-table>
</template>
<script setup>
import { ref, reactive, onMounted,nextTick, inject } from 'vue'
import MaFormTable from '@/components/ma-form-table/index.vue'
import AttributeBatch from './attributeBatch.vue'
import { get, set } from 'lodash'
const props = defineProps({
    specData: { type: Array, default: [] },
    attrData: { type: Array, default: [] }
})
// 规格数据
const specData = ref(props.specData)
// 属性表字段
const tableColumns = ref([])
// 属性数据
const attrData = ref(props.attrData)
const formModel = inject('formModel')
const {specName,specValue} = inject('specModel')

//初始化属性值
const initializeData = ref({
    image:"",
    price: 0.00,
    cost_price: 0.00,
    plain_price: 0.00,
    bar_code:"",
    sku_code:"",
    weight: 0,
    volume: 0,
    stock: 0
})

// 表数据
const tableData = ref([])
// 表格字段图片
const tableImageColumns = reactive(
    [
        {
            title: '图片',
            dataIndex: 'image',
            formType: 'custom-image',
            width: 100,
            align: 'center',
            fixed: 'left',
            imageProps: {
                width: 60,
                height: 60,
                center: true,//居中
                onlyUrl: true,
                returnType: 'url'
            }
        }
    ]
)
//基础字段定义
const tableColumnsBase = reactive([
    {
        title: '售价',
        dataIndex: 'price',
        formType: 'input-number',
        width: 160,
        precision: 2,
        min: 0,
        align: 'center',
        placeholder: '请输入售价'
    },
    {
        title: '成本价',
        dataIndex: 'cost_price',
        formType: 'input-number',
        width: 160,
        precision: 2,
        min: 0,
        align: 'center',
        placeholder: '请输入成本价'
    },
    {
        title: '原价',
        dataIndex: 'plain_price',
        formType: 'input-number',
        width: 160,
        precision: 2,
        min: 0,
        align: 'center',
        placeholder: '请输入原价'
    },
    {
        title: '商品条形码',
        dataIndex: 'bar_code',
        formType: 'input',
        width: 160,
        placeholder: '请输入商品条形码'
    },
    {
        title: '商品编号',
        dataIndex: 'sku_code',
        formType: 'input',
        width: 160,
        placeholder: '请输入商品编号'
    },
    {
        title: '重量KG',
        dataIndex: 'weight',
        formType: 'input-number',
        width: 160,
        align: 'center',
        min: 0,
        placeholder: '请输入重量KG',
    },
    {
        title: '体积(m³)',
        dataIndex: 'volume',
        formType: 'input-number',
        width: 160,
        min: 0,
        align: 'center',
        placeholder: '请输入体积(m³)',
    },
    {
        title: '库存',
        dataIndex: 'stock',
        formType: 'input-number',
        width: 160,
        min: 0,
        align: 'center',
        placeholder: '请输入库存',
        fixed: 'right'
    }
]);
//表配置
const tableConfig = ref({
    scroll: { x: '100%', y: '100%' },
    scrollbar: true, //表格的滚动属性配置。
    pagination: false,
    hideButDel:true,//索引删除按钮是否隐藏
    virtualListProps: { height: 405 },
    tableLayoutFixed: true,//表格的 table-layout 属性设置为 fixed，设置为 fixed 后，表格的宽度不会被内容撑开超出 100%。
    bordered: { headerCell: true, bodyCell: true, wrapper: true }//是否显示边框 boolean | TableBorder
})
//获取表头字段
const getTableHeader = (data) => {
    //去除规格空的情况
    const filteredData = data.filter(item => item[`${specName}`] && item[`${specValue}`].length > 0);
    let columns = filteredData.map((item, index) => ({
        title: item[`${specName}`],
        dataIndex: 'sku_attr_' + index,
        align: 'center',
        formType: 'text', // 根据需要设置默认值
        width: 150,
    }));
    return tableImageColumns.concat(columns.concat(tableColumnsBase))
}

/**
 * 生成给定对象数组的笛卡尔积的生成器函数
 * @param {Array} objectArray 包含对象的数组，每个对象有 title 和 list 属性
 * @yields {Object} 笛卡尔积的一个组合对象
 */
function* generateCartesianProduct(objectArray, index = 0, combination = {}) {
    // 如果已经遍历完所有对象，则生成一个笛卡尔积组合对象并返回
    if (index === objectArray.length) {
        yield combination;
        return;
    }
    // 遍历当前对象的列表
    for (let item of objectArray[index][`${specValue}`]) {
        // 创建新的组合对象，包含当前对象的属性值
        let newCombination = { ...combination, ['sku_attr_' + index]: item, ...initializeData.value };
        // 递归调用生成笛卡尔积的下一个对象的组合
        yield* generateCartesianProduct(objectArray, index + 1, newCombination);
    }
}

/**
 * 生成给定对象数组的笛卡尔积
 * @param {Array} objectArray 包含对象的数组，每个对象有 title 和 list 属性
 * @returns {Array} 笛卡尔积数组，每个元素是一个包含所有属性的对象
 */
function generateCartesianProductArray(objectArray) {
    // 初始化结果数组
    let result = [];
    let dataIndex = 0;
    // 遍历生成笛卡尔积的所有组合，并将其添加到结果数组中
    for (let combination of generateCartesianProduct(objectArray)) {
        if (attrData.value[dataIndex]) {
            combination = Object.assign(combination, attrData.value[dataIndex]);
        }
        result.push(combination);
        dataIndex++;
    }
    set(formModel.value, 'attrList', result)
    return result;
}

onMounted(() => {
    tableColumns.value = getTableHeader(specData.value);
    if (specData.value.length > 0) {
        nextTick(()=>{
            tableData.value = generateCartesianProductArray(specData.value)
        })
    }
})
</script>