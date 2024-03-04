<template>
    <a-layout class="h-full overflow-y-auto">
        <a-layout-header>
            <div :style="{ background: 'var(--color-fill-2)' }" class="mb-3">
                <a-page-header :style="{ background: 'var(--color-bg-2)' }" title="新增商品" subtitle="version: 1.0" />
            </div>
        </a-layout-header>
        <a-layout-content class="bg-[#fff] p-3 mb-[61px] animate__animated animate__pulse">
            <ma-form v-model="formData" :options="options" :columns="columns" ref="crudForm">
                <template #form-freightTemp>
                    <div class="flex items-center justify-center w-full">
                        <div class="w-full">
                            <a-select v-model="formData['freightTemp']" :options="freightTmpDict" placeholder="请选择运费模版" />
                        </div>
                        <div class="w-[120px] ml-2">
                            <a-link>新增运费模版</a-link>
                        </div>
                    </div>
                </template>
            </ma-form>
        </a-layout-content>
        <a-layout-footer class="bg-[#fff] h-[60px] absolute bottom-0 w-full left-0 border-t border-solid z-[999]">
            <a-space class="h-full flex items-center justify-center">
                <a-button type="outline" @click="handleBack" :disabled="activeTabs == 0">上一步</a-button>
                <a-button type="primary" @click="handleNext" :disabled="activeTabs >= tabsTmp.length - 1">下一步</a-button>
                <a-button type="primary" @click="submitForm">保存</a-button>
            </a-space>
        </a-layout-footer>
    </a-layout>
</template>
<script setup>
import { ref, reactive, shallowRef } from 'vue'
import details from './components/details.vue'
import specComponent from './components/spec.vue'
const crudForm = ref()
const activeTabs = ref(1)
//单规格信息是否显示
const oddSpecShow = ref(false)
//多规格信息是否显示
const multipleSpecShow = ref(false)
const submitForm = () => {
    const data = crudForm.value.getFormData();
    console.log(data)
}

/**
 * 上一步
 */
const handleBack = () => {
    if (activeTabs.value) {
        activeTabs.value -= 1;
    }
}
/**
 * 下一步
 */
const handleNext = () => {
    let limit = tabsTmp.length - 1;
    if (activeTabs.value < limit) {
        activeTabs.value += 1;
    }
}

const options = ref({
    showButtons: false
})
const formData = ref({
    goods_type: 2,
    sale_model: 2,
    spec_list: [
        {
            spec_name: '选择颜色',
            spec_value: ['粉色', '黄色', '绿色', '蓝色', '黑色']
        },
        {
            spec_name: '选择版本',
            spec_value: ['128GB', '256GB', '512GB']
        },
        {
            spec_name: '购买方式',
            spec_value: ['公开版', '快充套装', 'A+会员版', '一年AC+套餐版', '两年值享换新套装版']
        },
        {
            spec_name: '套装',
            spec_value: ['优惠套装1', '优惠套装2', '优惠套装3', '优惠套装4', '优惠套装5', '优惠套装6']
        }
    ]
})

/**
 * 运费模版类型字典
 */
const freightTypeDict = reactive([
    { label: '包邮', value: 1 },
    { label: '固定邮费', value: 2 },
    { label: '运费模版', value: 3 },
])
/**
 * 运费模版字典
 */
const freightTmpDict = reactive([
    { label: '通用模版', value: 1 },
    { label: '全国包邮', value: 2 },
])

//商品类型字典
const goodsTypeDict = reactive([
    { label: '普通商品', value: 1, describe: '物流发货' },
    { label: '卡密/网盘', value: 2, describe: '自动发货' },
    { label: '优惠券', value: 3, describe: '自动发货' },
    { label: '虚拟商品', value: 4, describe: '虚拟发货' }
])

const tabsTmp = reactive([
    {
        title: "基础信息",
        formList: [
            {
                title: '商品类型',
                dataIndex: 'goods_type',
                formType: 'radio',  // 默认为 input 组件
                styleType: 'card',
                rules: [{ required: true, message: '请输入商品类型' }],
                dict: {
                    data: goodsTypeDict
                }
            },
            {
                title: '商品分类',
                dataIndex: 'goods_category',
                formType: 'cascader',
                multiple: true,
                rules: [{ required: true, message: '请输入商品分类' }],
                options: [
                    {
                        label: '运动器材',
                        value: 1,
                        children: [
                            { label: '运动服饰', value: '1-1' },
                            { label: '户外装备', value: '1-2' },
                            { label: '车载电器', value: '1-3' },
                            { label: '骑行配件', value: '1-4' },
                            { label: '出现车品', value: '1-5' }
                        ]
                    },
                    { label: '电子产品', value: 2 },
                    {
                        label: '家用电器',
                        value: 3,
                        children: [
                            { label: '生活家电', value: '3-1' },
                            { label: '厨房大电', value: '3-2' },
                            { label: '卫浴电器', value: '3-3' },
                            { label: '卫浴清洁', value: '3-4' },
                            { label: '净化污染', value: '3-5' }
                        ]
                    },
                    {
                        label: '家具软装',
                        value: 4,
                        children: [
                            { label: '居家家具', value: '4-1' },
                            { label: '家饰软装', value: '4-2' },
                        ]
                    },
                    {
                        label: '美妆个护',
                        value: 5,
                        children: [
                            { label: '口腔清洁', value: '5-1' },
                            { label: '美妆工具', value: '5-2' },
                            { label: '护肤护理', value: '5-3' },
                            { label: '彩妆香氛', value: '5-4' },
                            { label: '按摩器械', value: '5-5' },
                        ]
                    },
                ]
            },
            {
                title: '商品标题',
                dataIndex: 'goods_title',
                rules: [{ required: true, message: '请输入商品标题' }]
            },
            {
                title: '商品编码',
                dataIndex: 'goods_number',
                placeholder: '请输入商品编码',
            },
            {
                title: '商品标签',
                dataIndex: 'goods_tag',
                formType: 'select',
                multiple: true,
                placeholder: '请选择商品标签',
                dict: {
                    data: [
                        { label: '普通商品', value: 1 },
                        { label: '卡密/网盘', value: 2 },
                        { label: '优惠券', value: 3 },
                        { label: '虚拟商品', value: 4 }
                    ]
                }
            },
            {
                title: '商品图片',
                dataIndex: 'goods_image',
                formType: 'upload',
                type: "custom-image",
                multiple: true,
                onlyData: true,
                returnType: "url",
                limit: 10,
                width: 60,
                height: 60,
                tip: "建议尺寸：800 * 800px，可拖拽改变图片顺序，默认首张图为主图，最多上传10张",
                rules: [{ required: true, message: '请上传商品图片' }]
            },
            {
                title: '发布模式',
                dataIndex: 'goods_push_model',
                formType: 'radio',  // 默认为 input 组件
                rules: [{ required: true, message: '请选择发布模式' }],
                dict: {
                    data: [
                        { label: '立即上架', value: 1 },
                        { label: '定时上架', value: 2 },
                        { label: '放入仓库', value: 3 }
                    ]
                },
                onControl: (val) => {
                    if (val == 2) return { goods_push_time: { display: true } };
                    formData.value.goods_push_time = "";
                    return { goods_push_time: { display: false } }
                }
            },
            {
                title: '',
                display: false,
                dataIndex: 'goods_push_time',
                formType: 'date',  // 默认为 input 组件
                showTime: true,
                placeholder: '请选择定时上架时间',
                help: '开启定时上架后，系统会在设置时间上架该商品。'
            },
            {
                title: '定时下架',
                dataIndex: 'fall_status',
                formType: 'switch',  // 默认为 input 组件
                checkedValue: 1, // 选中时的值
                uncheckedValue: 2, // 未选中时的值
                checkedText: "开启",
                uncheckedText: "关闭",
                onControl: (val) => {
                    if (val == 1) return { goods_fall_time: { display: true } };
                    formData.value.goods_fall_time = "";
                    return { goods_fall_time: { display: false } }
                }
            },
            {
                title: '',
                display: false,
                dataIndex: 'goods_fall_time',
                formType: 'date',  // 默认为 input 组件
                showTime: true,
                placeholder: '请选择定时下架时间',
                help: '开启定时下架后，系统会在设置时间下架该商品。下架时间需晚于开售时间，商品才能定时开售。'
            }
        ]
    },
    {
        title: "销售信息",
        formList: [
            {
                title: '销售方式',
                dataIndex: 'sale_model',
                formType: 'radio',  // 默认为 input 组件
                styleType: 'card',
                help: "*如有颜色、尺码等多种规格,请选择多规格",
                rules: [{ required: true, message: '请选择销售模式' }],
                dict: {
                    data: [
                        { label: '单规格', value: 1, describe: '统一规格信息' },
                        { label: '多规格', value: 2, describe: '多种规格信息' }
                    ]
                },
                onControl:(val)=>{
                    if (val == 2) {
                        oddSpecShow.value = false;
                        multipleSpecShow.value = true
                    } else if (val == 1) {
                        oddSpecShow.value = true;
                        multipleSpecShow.value = false
                    }
                }
            },
            {
                formType: 'grid-tailwind',
                customClass: ["mt-3"],
                colNumber: 1,
                cols: [
                    {
                        display: oddSpecShow,
                        formList: [
                            {
                                title: '规格图片',
                                dataIndex: 'image',
                                formType: 'upload',
                                type: "custom-image",
                                multiple: false,
                                onlyData: true,
                                returnType: "url",
                                iconTitle: '上传图片',
                                width: 70,
                                height: 70
                            },
                            {
                                dataIndex: 'price',
                                title: '销售价格',
                                formType: 'input-number',
                                precision: 2,
                                rules: [{ required: true, message: '请输入规格售价' }]
                            },
                            {
                                dataIndex: 'cost_price',
                                title: '成本价格',
                                formType: 'input-number',
                                precision: 2,
                                rules: [{ required: true, message: '请输入成本价格' }]
                            },
                            {
                                dataIndex: 'plain_price',
                                title: '销售原价',
                                formType: 'input-number',
                                precision: 2,
                                placeholder: '请输入销售原价',
                                rules: [{ required: true, message: '请输入销售原价' }]
                            },
                            {
                                dataIndex: 'stock',
                                title: '销售库存',
                                formType: 'input-number',
                                rules: [{ required: true, message: '请输入销售库存' }]
                            },
                            {
                                dataIndex: 'number',
                                title: '销售编号',
                                formType: 'input',
                                placeholder: '请输入销售编号'
                            },
                            {
                                dataIndex: 'bar_code',
                                title: '销售条码',
                                formType: 'input',
                                placeholder: '请输入条形码'
                            },
                            {
                                dataIndex: 'weight',
                                title: '重量(KG)',
                                formType: 'input-number',
                                placeholder: '请输入重量(KG)'
                            },
                            {
                                dataIndex: 'volume',
                                title: '体积(m³)',
                                formType: 'input-number',
                                placeholder: '请输入体积(m³)'
                            }
                        ]
                    }, {
                        display: multipleSpecShow,
                        formList: [
                            {
                                title: '规格模版',
                                dataIndex: 'specs_template',
                                formType: 'select',
                                multiple: false,
                                placeholder: '请选择规格模版',
                                dict: {
                                    data: [
                                        { label: '汽车玻璃', value: 1 },
                                        { label: '男士洁面', value: 2 },
                                        { label: '美妆工具', value: 3 },
                                        { label: '电脑配件', value: 4 }
                                    ]
                                }
                            },
                            {
                                title: '销售规格',
                                dataIndex: 'spec_list',
                                formType: 'component',
                                component: shallowRef(specComponent)
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: "商品详情",
        formList: [
            {
                title: '商品详情',
                dataIndex: 'goods_details',
                hideLabel: true,
                formType: 'component',
                component: shallowRef(details),
                height: 600,
                rules: [{ required: true, message: '请输入商品详情' }]
            }
        ]
    },
    {
        title: "物流设置",
        formList: [
            {
                title: '物流方式',
                dataIndex: 'logistics',
                formType: 'checkbox',
                dict: {
                    data: [
                        { label: '快递', value: '1' },
                        { label: '自提', value: '2' },
                    ]
                },
                rules: [{ required: true, message: '请选择物流方式' }]
            },
            {
                title: '运费设置',
                dataIndex: 'freightType',
                formType: 'radio',
                onControl: (val) => {
                    if (val == 2) {
                        return {
                            freightMoney: { display: true },
                            freightTemp: { display: false }
                        }
                    } else if (val == 3) {
                        return {
                            freightMoney: { display: false },
                            freightTemp: { display: true }
                        }
                    } else {
                        return {
                            freightMoney: { display: false },
                            freightTemp: { display: false }
                        }
                    }
                },
                dict: {
                    data: freightTypeDict
                }
            },
            {
                title: '',
                dataIndex: 'freightTemp',
                formType: 'select',
                display: false,
                placeholder: '请选择运费模版',
                dict: {
                    data: freightTmpDict
                }
            },
            {
                title: '',
                dataIndex: 'freightMoney',
                formType: 'input-number',
                precision: 2,
                display: false,
                min: 0,
                defaultValue: 0.00,
                placeholder: '请输入运费'
            },
        ]
    }
])
//表单字段
const columns = reactive([
    {
        formType: 'tabs',
        customClass: ['goods_tabs'],
        active: activeTabs,
        tabs: tabsTmp
    }
])
</script>