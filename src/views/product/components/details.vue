<template>
    <!-- 组件外部的 form-item -->
    <a-row :gutter="24" class="w-full">
        <a-col :span="16">
            <ma-editor v-model="value" :height="props.component.height"
            :toolbar="toolbar"
                :id="props.component.id" @change="maEvent.handleChangeEvent(props.component, $event)">
            </ma-editor>
        </a-col>
        <a-col :span="8">
            <div :class="['relative','mx-auto','border','rounded-xl','w-[330px]']" :style="{height:props.component.height+'px'}">
                <div class="absolute w-full h-[50px]">
                    <span class="flex h-full items-center justify-center">详情预览</span>
                </div>
                <div class="h-full rounded-xl px-[20px] pb-[40px] pt-[50px]">
                    <div class="overflow-auto h-full" v-html="value"></div>
                </div>
            </div>
        </a-col>
    </a-row>
</template>
<script setup>
// 引入相关vue必要的api
import { ref, inject, onMounted, watch } from 'vue'
import MaEditor from '@/components/ma-editor/index.vue'
// 引入处理索引的函数
import { get, set } from 'lodash'
// 引入处理事件的函数
import { runEvent } from '@/components/ma-form/js/event.js'
// 组件都需要定义以下的props
const props = defineProps({
    component: Object,
    customField: { type: String, default: undefined }
})
const toolbar = ref("code forecolor backcolor bold italic underline strikethrough link alignleft aligncenter alignright alignjustify outdent indent formatpainter styleselect formatselect fontselect fontsizeselect bullist numlist blockquote subscript superscript removeformat table resource")
// form数据列表
const formModel = inject('formModel')
// 使用数据字典，如有必要使用可加入下面这行代码
const dictList = inject('dictList')
const getColumnService= inject('getColumnService')
const columns = inject('columns')
const rv = async (ev, value = undefined) => await runEvent(props.component, ev, { formModel, getColumnService, columns }, value)
// 该组件在form数据的索引名称
const index = props.customField ?? props.component.dataIndex
// 该组件的表单数据
const value = ref(get(formModel.value, index))
// 监听组件数据的改变
watch(() => get(formModel.value, index), vl => value.value = vl)
watch(() => value.value, v => set(formModel.value, index, v))

// 绑定组件事件
// 绑定组件事件
rv('onCreated')
onMounted(() => rv('onMounted'))
</script>