<template>
    <a-row class="w-[600px]">
        <a-col :span="15">
            <div class="w-full h-[300px] overflow-y-auto">
                <div class="mb-3" v-for="(item, key) in props.specList" :key="key">
                    <div class="text-[14px] mb-2">{{ item[`${specName}`] }}</div>
                    <a-space wrap>
                        <a-tag v-for="(title, index) in item[`${specValue}`]" :key="index" checkable
                            :default-checked="false" color="arcoblue" class="bg-[#eee]"
                            @check="handleChecked($event, key, title)">{{ title
                            }}</a-tag>
                    </a-space>
                </div>
            </div>
        </a-col>
        <a-col :span="9" class="border-l pl-4">
            <div class="w-full">
                <div class="mb-3">
                    <div class="text-[14px] mb-2">设置图片:</div>
                    <ma-upload class="mt-2" v-model="data.image" fit="contain" :width="208" :height="100" :center="false"
                        :onlyUrl="true" returnType="url" type="custom-image"></ma-upload>
                </div>
                <div class="mb-3">
                    <div class="text-[14px] mb-2">选择属性:</div>
                    <a-select v-model="data.column" placeholder="请选择修改项" allow-clear @change="getComponent"
                        @clear="handleColumnClear">
                        <a-option v-for="(column, columnIndex) in props.columns" :key="columnIndex"
                            :value="column.dataIndex">{{ column.title }}</a-option>
                    </a-select>
                </div>
                <div class="mb-3">
                    <div class="text-[14px] mb-2">属性值:</div>
                    <component :is="getComponentName(component?.formType ?? 'input')" v-bind="component"
                        v-model="data.columnValue">
                    </component>
                </div>
            </div>
            <div class="">
                <a-button type="primary" size="mini" long @click="handleBatchModify"
                    :disabled="getButtonStatus()">确认修改</a-button>
            </div>
        </a-col>
    </a-row>
</template>
<script setup>
import { ref, inject ,nextTick} from 'vue';
import { Message } from '@arco-design/web-vue'
const props = defineProps({
    specList: { type: Array, default: [] },
    columns: { type: Array, default: [] }
})
const formModel = inject('formModel')
const {specName,specValue} = inject('specModel')

const data = ref({
    image: "",
    column: "",
    columnValue: undefined
});
const component = ref("")
const searchKeys = ref([])

/**
 * 获取组件
 */
const getComponent = (dataIndex) => {
    data.value.columnValue = undefined
    component.value = props.columns.find(item => item.dataIndex === dataIndex);
}
/**
 * 清空选择字段回调
 */
const handleColumnClear = () => {
    data.value.column = ""
    data.value.columnValue = undefined
}
/**
 * @param formType 组件名称
 */
const getComponentName = (formType) => {
    return `a-${formType}`;
};

/**
 * 获取批量修改按钮状态
 */
const getButtonStatus = () => {
    if (data.value.image) {
        return false
    } else if (data.value.column && data.value.columnValue >= 0) {
        return false;
    } else {
        return true
    }
}

/**
 * 选择的规格
 */
const handleChecked = (checked, specsIndex, specsTitle) => {
    if (checked) {
        let beeIndex = searchKeys.value.findIndex((obj) => obj.specsIndex === specsIndex)
        if (beeIndex < 0) {
            searchKeys.value.push({ specsIndex, list: [specsTitle] })
        } else {
            let listIndex = searchKeys.value[beeIndex]['list'].findIndex((item) => item === specsTitle)
            if (listIndex < 0) {
                searchKeys.value[beeIndex]['list'].push(specsTitle)
            }
        }
    } else {
        let beeIndex = searchKeys.value.findIndex((obj) => obj['specsIndex'] === specsIndex)
        if (beeIndex >= 0) {
            let listIndex = searchKeys.value[beeIndex]['list'].findIndex((item) => item === specsTitle)
            if (listIndex >= 0) {
                searchKeys.value[beeIndex]['list'].splice(listIndex, 1)
                let length = searchKeys.value[beeIndex]['list'].length
                if (!length) {
                    searchKeys.value.splice(beeIndex, 1)
                }
            }
        }
    }
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
    // 获取当前对象的标题和列表
    let { specsIndex, list } = objectArray[index];
    // 遍历当前对象的列表
    for (let item of list) {
        // 创建新的组合对象，包含当前对象的属性值
        let newCombination = { ...combination, ['sku_attr_' + specsIndex]: item };
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
        result.push(combination);
        dataIndex++;
    }
    return result;
}

/**
 * 批量执行修改属性值
 * @param objectArray
 */
function findMatchingObjects(searchList) {
    searchList.forEach((bItem) => {
        formModel.value.attrList.find((aItem) => {
            let exist = Object.keys(bItem).every((key) => {
                return aItem[key] === bItem[key];
            });
            if (exist) {
                if (data.value.column && data.value.columnValue >= 0) {
                    aItem[data.value.column] = data.value.columnValue
                }
                if (data.value.image) {
                    //修改图片
                    aItem['image'] = data.value.image
                }
            }
        });
    });
}



/**
 * 批量修改
 */
function handleBatchModify() {
    nextTick(()=>{
        if (searchKeys.value.length) {
            findMatchingObjects(generateCartesianProductArray(searchKeys.value))
        } else {
            if (data.value.image || data.value.column && data.value.columnValue >= 0) {
                for (const aItem of formModel.value.attrList) {
                    if (data.value.column && data.value.columnValue >= 0) {
                        aItem[data.value.column] = data.value.columnValue
                    }
                    if (data.value.image) {
                        aItem['image'] = data.value.image
                    }
                }
            }
        }
        Message.success("批量修改成功")
    })
}
</script>