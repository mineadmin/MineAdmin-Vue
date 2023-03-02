<template>
  <div class="ma-content-block p-5"><ma-form v-model="form" :options="options" :columns="columns" /></div>
</template>
<script setup>
import { ref } from 'vue'

const form = ref({})
const options = ref({})
const columns = ref([
  {
    formType: 'grid',
    customClass: ['mb-2'],
    cols: [
      {
        span: 24,
        formList: [{ formType: 'divider', title: '基础信息'}]
      },
      {
        span: 3,
        formList: [{ formType: 'upload', dataIndex: 'avatar', title: '免冠照片', hideLabel: true,}]
      },
      {
        span: 21,
        formList: [
          {
            formType: 'grid-tailwind',
            colNumber: 3,
            cols: [
              {
                formList: [
                  { title: '姓名', dataIndex: 'name' }
                ]
              }, {
                formList: [
                  { title: '出生年月', dataIndex: 'bron', formType: 'date' }
                ]
              }, {
                formList: [
                  { title: '求职意向', dataIndex: 'zhiwei', }
                ]
              }
            ]
          },{
            formType: 'grid-tailwind',
            colNumber: 3,
            cols: [
              {
                formList: [
                  { title: '籍贯', dataIndex: 'jiguan' }
                ]
              }, {
                formList: [
                  {
                    title: '政治面貌', dataIndex: 'mianmao', formType: 'select',
                    dict: { data: [{label: '党员', value: 1},{label: '团员', value: 2},{label: '群众', value: 3}] }
                  }
                ]
              }, {
                formList: [
                  {
                    title: '现居地', dataIndex: 'xianjudi', formType: 'input',
                  }
                ]
              }
            ]
          },{
            formType: 'grid-tailwind',
            colNumber: 3,
            cols: [
              {
                formList: [
                  { title: '联系电话', dataIndex: 'dianhua' }
                ]
              }, {
                formList: [
                  {
                    title: '邮箱', dataIndex: 'email'
                  }
                ]
              }, {
                formList: [
                  {
                    title: '目前状态', dataIndex: 'zhuangtai', formType: 'select',
                    dict: { data: [{label: '在职', value: 1},{label: '待业', value: 2}] }
                  }
                ]
              }
            ]
          }
        ]
      },
    ]
  },
  {
    formType: 'card', title: '教育经历', hideLabel: true,
    customClass: ['mb-5'],
    formList: [
      {
        title: '添加教育经历',
        formType: 'children-form',
        dataIndex: 'shangxuejingli',
        type: 'table',
        formList: [
          {
            dataIndex: 'qishinian', title: '起始年月', formType: 'date', mode: 'month',
          },{
            dataIndex: 'endnian', title: '结束年月', formType: 'date', mode: 'month',
          },{
            dataIndex: 'xuexiao', title: '毕业学校',
          },{
            dataIndex: 'xueli', title: '学历',
          },{
            dataIndex: 'zhuanye', title: '主修专业',
          }
          
        ]  
      }
    ]
  },
  {
    formType: 'card', title: '工作经历', hideLabel: true,
    customClass: ['mb-5'],
    formList: [
      {
        title: '添加工作经历',
        formType: 'children-form',
        dataIndex: 'workjingli',
        type: 'group',
        formList: [
          {
            dataIndex: 'qishinian', title: '起始年月', formType: 'date', mode: 'month',
          },{
            dataIndex: 'endnian', title: '结束年月', formType: 'date', mode: 'month',
          },{
            dataIndex: 'gongsi', title: '公司名称',
          },{
            dataIndex: 'zhiwei', title: '职位',
          },{
            dataIndex: 'jieshao', title: '工作介绍', formType: 'editor', height: 260,
          }
          
        ]  
      }
    ]
  },
  {
    formType: 'editor',
    title: '自我评价',
    dataIndex: 'ziwopingjia'
  }
])

</script>