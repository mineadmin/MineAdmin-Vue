<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :crud="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import openProduct from '@/api/open/openProduct'
import { Message } from '@arco-design/web-vue'
import tool from '@/utils/tool'
import * as common from '@/utils/common'

const crudRef = ref()


const numberOperation = (newValue, id, numberName) => {
  openProduct.numberOperation({ id, numberName, numberValue: newValue }).then( res => {
    res.success && Message.success(res.message)
  }).catch( e => { console.log(e) } )
}

const switchStatus = (statusValue, id, statusName) => {
  openProduct.changeStatus({ id, statusName, statusValue }).then( res => {
    res.success && Message.success(res.message)
  }).catch( e => { console.log(e) } )
}


const crud = reactive({
  rowSelection: {
    showCheckedAll: true
  },
  searchLabelWidth: '75px',
  pk: 'id',
  operationColumn: true,
  operationWidth: 160,
  viewLayoutSetting: {
    layout: 'auto',
    cols: 1,
    viewType: 'modal',
    width: 600
  },
  api: openProduct.getList,
  recycleApi: openProduct.getRecycleList,
  add: {
    show: true,
    api: openProduct.save,
    auth: ['open:product:save']
  },
  edit: {
    show: true,
    api: openProduct.update,
    auth: ['open:product:update']
  },
  delete: {
    show: true,
    api: openProduct.deletes,
    auth: ['open:product:delete'],
    realApi: openProduct.realDeletes,
    realAuth: ['open:product:realDeletes']
  },
  recovery: {
    show: true,
    api: openProduct.recoverys,
    auth: ['open:product:recovery']
  },
  import: {
    show: true,
    url: 'open/product/import',
    templateUrl: 'open/product/downloadTemplate',
    auth: ['open:product:import']
  },
  export: {
    show: true,
    url: 'open/product/export',
    auth: ['open:product:export']
  }
})

const columns = reactive([
  {
    title: "id",
    dataIndex: "id",
    formType: "input",
    search: true,
    addDisplay: false,
    editDisplay: false,
    sortable: {
      sortDirections: [
        "ascend",
        "descend"
      ],
      sorter: true
    }
  },
  {
    title: "商品图片",
    dataIndex: "image",
    formType: "upload",
    rules: {
      required: true,
      message: "请输入商品图片"
    }
  },
  {
    title: "分类id",
    dataIndex: "classfiy_id",
    formType: "select",
    search: true,
    rules: {
      required: true,
      message: "请输入分类id"
    }
  },
  {
    title: "推荐图",
    dataIndex: "recommend_image",
    formType: "upload"
  },
  {
    title: "轮播图",
    dataIndex: "slider_image",
    formType: "upload"
  },
  {
    title: "商品名称",
    dataIndex: "store_name",
    formType: "input",
    search: true,
    rules: {
      required: true,
      message: "请输入商品名称"
    }
  },
  {
    title: "商品简介",
    dataIndex: "store_info",
    formType: "editor",
    rules: {
      required: true,
      message: "请输入商品简介"
    }
  },
  {
    title: "关键字",
    dataIndex: "keyword",
    formType: "input",
    search: true
  },
  {
    title: "商品价格",
    dataIndex: "price",
    formType: "input-number",
    rules: {
      required: true,
      message: "请输入商品价格"
    },
    sortable: {
      sortDirections: [
        "ascend",
        "descend"
      ],
      sorter: true
    },
    precision: 3,
    max: 1000000,
    min: 0
  },
  {
    title: "市场价",
    dataIndex: "ot_price",
    formType: "input-number",
    rules: {
      required: true,
      message: "请输入市场价"
    },
    precision: 3,
    step: 0,
    max: 1000000,
    min: 0
  },
  {
    title: "单位名",
    dataIndex: "unit_name",
    formType: "input",
    search: true,
    rules: {
      required: true,
      message: "请输入单位名"
    }
  },
  {
    title: "排序",
    dataIndex: "sort",
    formType: "input",
    rules: {
      required: true,
      message: "请输入排序"
    }
  },
  {
    title: "销量",
    dataIndex: "sales",
    formType: "input",
    rules: {
      required: true,
      message: "请输入销量"
    },
    sortable: {
      sortDirections: [
        "ascend",
        "descend"
      ],
      sorter: true
    }
  },
  {
    title: "库存",
    dataIndex: "stock",
    formType: "input",
    search: true,
    rules: {
      required: true,
      message: "请输入库存"
    }
  },
  {
    title: "发送类型",
    dataIndex: "send_type",
    formType: "radio",
    search: true,
    rules: {
      required: true,
      message: "请输入发送类型"
    },
    dict: {
      data: [
        {
          label: "手动发货",
          value: "1"
        },
        {
          label: "接口发货",
          value: "2"
        }
      ],
      translation: true
    }
  },
  {
    title: "上架",
    dataIndex: "is_show",
    formType: "switch",
    search: true,
    rules: {
      required: true,
      message: "请输入上架"
    },
    checkedValue: "1",
    uncheckedValue: "0"
  },
  {
    title: "是否删除",
    dataIndex: "is_del",
    formType: "input",
    addDisplay: false,
    editDisplay: false,
    hide: true
  },
  {
    title: "成本价",
    dataIndex: "cost",
    formType: "input",
    search: true,
    rules: {
      required: true,
      message: "请输入成本价"
    }
  },
  {
    title: "是否优品推荐",
    dataIndex: "is_good",
    formType: "switch",
    checkedValue: "1",
    uncheckedValue: "0"
  },
  {
    title: "虚拟销量",
    dataIndex: "ficti",
    formType: "input"
  },
  {
    title: "浏览量",
    dataIndex: "browse",
    formType: "input",
    rules: {
      required: true,
      message: "请输入浏览量"
    }
  },
  {
    title: "自定义表单",
    dataIndex: "custom_form",
    formType: "input",
    hide: true
  },
  {
    title: "创建人",
    dataIndex: "created_by",
    formType: "input",
    addDisplay: false,
    editDisplay: false,
    hide: true
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    formType: "input",
    search: true,
    addDisplay: false,
    editDisplay: false,
    hide: true
  },
  {
    title: "更新人",
    dataIndex: "updated_by",
    formType: "input",
    addDisplay: false,
    editDisplay: false,
    hide: true
  },
  {
    title: "更新时间",
    dataIndex: "updated_at",
    formType: "input",
    search: true,
    addDisplay: false,
    editDisplay: false,
    hide: true
  }
])
</script>
<script> export default { name: 'open:product' } </script>