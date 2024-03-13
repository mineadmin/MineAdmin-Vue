<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <a-spin dot  v-if="configOK === false"/>
    <!-- CRUD 组件 -->
    <ma-crud :options="options" :columns="columns" ref="crudRef" v-if="configOK === true">
    </ma-crud>
  </div>
</template>
<script setup>
import {ref, reactive} from 'vue'
import {Message} from '@arco-design/web-vue'
import tool from '@/utils/tool'
import * as common from '@/utils/common'
import {request} from '@/utils/request.js'
import {useRouter} from "vue-router";

const crudRef = ref()

const configOK = ref(false)

const {currentRoute} = useRouter();
const route = currentRoute.value;

const getTableConfig = (params = {}) => {
  return request({
    url: 'setting' + route.path,
    method: 'get',
    params
  })
};

let options = ref({});
let columns = ref([]);

const getFromOption = (data) => {
  let opt = {};
  switch (data.component_type) {
    case 1:
      opt.viewType = 'modal'
      break
    case 2:
      opt.viewType = 'drawer'
      break
    case 3:
      opt.viewType = 'tag'
      if (data.options.tag_id) {
        opt.tagId = data.options.tag_id
      }
      if (data.options.tag_name) {
        opt.tagName = data.options.tag_name
      }
      if (data.options.tag_view_name) {
        opt.titleDataIndex = data.options.tag_view_name
      }
      break
  }
  opt.width = 600
  console.log(opt)
  return opt
}

getTableConfig().then(response => {
  if (response.success) {

    console.log(response.data.id)
    response.data.columns.forEach((item) => {
      columns.value.push({
        title: item.column_comment,
        formType: item.view_type === 'text' ? 'input' : item.view_type,
        dataIndex: item.column_name,
        addDisplay: item.is_insert === 2,
        editDisplay: item.is_edit === 2,
        hide: item.is_list === 1,
        search: item.is_query === 2,
        commonRules: item.is_required === 2 ? {
          required: true,
          message: "请输入主键"
        } : null,
      })
    });
    let menus = response.data.generate_menus.split(',');

    options = reactive({
      id: response.data.table_name,
      rowSelection: {
        showCheckedAll: true
      },
      pk: 'id',
      operationColumn: true,
      operationColumnWidth: 160,
      formOption: getFromOption(response.data),
      api: (params = {}) => {
        return request({
          url: 'setting/autoform/index/' + response.data.id,
          method: 'get',
          params
        })
      },
      recycleApi: (params = {}) => {
        return request({
          url: 'setting/autoform/recycle/' + response.data.id,
          method: 'get',
          params
        })
      },
      add: {
        show: menus.includes('save'),
        api: (data = {}) => {
          return request({
            url: 'setting/autoform/save/' + response.data.id,
            method: 'post',
            data
          })
        },
        //auth: ['test:crontab:save']
      },
      edit: {
        show: menus.includes('update'),
        api: (id, data = {}) => {
          return request({
            url: 'setting/autoform/update/' + response.data.id + '/' + id,
            method: 'put',
            data
          })
        },
        // auth: ['test:crontab:update']
      },
      delete: {
        show: menus.includes('delete'),
        api: (data) => {
          return request({
            url: 'setting/autoform/delete/' + response.data.id,
            method: 'delete',
            data
          })
        },
        // auth: ['test:crontab:delete'],
        realApi: (data) => {
          return request({
            url: 'setting/autoform/realDelete/' + response.data.id,
            method: 'delete',
            data
          })
        },
        // realAuth: ['test:crontab:realDeletes']
      },
      recovery: {
        show: menus.includes('recycle'),
        api: (data) => {
          return request({
            url: 'setting/autoform/recovery/' + response.data.id,
            method: 'put',
            data
          })
        },
        // auth: ['test:crontab:recovery']
      },
      import: {
        show: false,
        url: 'autoform/import',
        templateUrl: 'test/crontab/downloadTemplate',
        auth: ['test:crontab:import']
      },
      export: {
        show: false,
        url: 'autoform/export',
        auth: [], //'test:crontab:export']
      }
    })

    configOK.value = true
  }
}).catch(err => {
  console.error(error)
});

//
// const numberOperation = (newValue, id, numberName) => {
//   testCrontab.numberOperation({id, numberName, numberValue: newValue}).then(res => {
//     res.success && Message.success(res.message)
//   }).catch(e => {
//     console.log(e)
//   })
// }
//
// const switchStatus = (statusValue, id, statusName) => {
//   testCrontab.changeStatus({id, statusName, statusValue}).then(res => {
//     res.success && Message.success(res.message)
//   }).catch(e => {
//     console.log(e)
//   })
// }


//
// const columns = reactive([
//   {
//     title: "主键",
//     dataIndex: "id",
//     formType: "input",
//     addDisplay: false,
//     editDisplay: false,
//     hide: true,
//     commonRules: {
//       required: true,
//       message: "请输入主键"
//     }
//   },
//   {
//     title: "任务名称",
//     dataIndex: "name",
//     formType: "input",
//     search: true
//   },
//   {
//     title: "任务类型 (1 command, 2 class, 3 url, 4 eval)",
//     dataIndex: "type",
//     formType: "input",
//     search: true
//   },
//   {
//     title: "调用任务字符串",
//     dataIndex: "target",
//     formType: "input",
//     search: true
//   },
//   {
//     title: "调用任务参数",
//     dataIndex: "parameter",
//     formType: "input",
//     search: true
//   },
//   {
//     title: "任务执行表达式",
//     dataIndex: "rule",
//     formType: "input",
//     search: true
//   },
//   {
//     title: "是否单次执行 (1 是 2 不是)",
//     dataIndex: "singleton",
//     formType: "input",
//     search: true
//   },
//   {
//     title: "状态 (1正常 2停用)",
//     dataIndex: "status",
//     formType: "input",
//     search: true
//   },
//   {
//     title: "创建者",
//     dataIndex: "created_by",
//     formType: "input",
//     addDisplay: false,
//     editDisplay: false,
//     hide: true
//   },
//   {
//     title: "更新者",
//     dataIndex: "updated_by",
//     formType: "input",
//     addDisplay: false,
//     editDisplay: false,
//     hide: true
//   },
//   {
//     title: "创建时间",
//     dataIndex: "created_at",
//     formType: "date",
//     addDisplay: false,
//     editDisplay: false,
//     hide: true,
//     showTime: true
//   },
//   {
//     title: "更新时间",
//     dataIndex: "updated_at",
//     formType: "date",
//     addDisplay: false,
//     editDisplay: false,
//     hide: true,
//     showTime: true
//   },
//   {
//     title: "备注",
//     dataIndex: "remark",
//     formType: "input",
//     addDisplay: false,
//     editDisplay: false,
//     hide: true
//   }
// ])
</script>
<script> export default {name: 'test:crontab'} </script>