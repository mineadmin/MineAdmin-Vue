<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <a-spin dot  v-if="configOK === false"/>
    <!-- CRUD 组件 -->
    <ma-crud :options="options" :columns="columns" ref="crudRef" v-if="configOK === true">
      <template #status="{ record }">
        <a-switch
            :checked-value="1"
            unchecked-value="2"
            @change="switchStatus($event, record.id)"
            :default-checked="record.status == 1"
        />
      </template>
<!--      -->
<!--      <template v-slot:[slotName] = "{ record }"  >-->
<!--&lt;!&ndash;        <a-switch&ndash;&gt;-->
<!--&lt;!&ndash;            :checked-value="1"&ndash;&gt;-->
<!--&lt;!&ndash;            unchecked-value="2"&ndash;&gt;-->
<!--&lt;!&ndash;            @change="changeStatus($event, record.id)"&ndash;&gt;-->
<!--&lt;!&ndash;            :default-checked="record.status == 1"&ndash;&gt;-->
<!--&lt;!&ndash;        />&ndash;&gt;-->
<!--      </template>-->

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

let slotName = ref('status');

const getTableConfig = (params = {}) => {
  return request({
    url: 'setting' + route.path,
    method: 'get',
    params
  })
};

let options = ref({});
let columns = ref([]);
let table_id = ref(0);


const getFormViewType = (item) => {
  if (item.view_type === 'text') {
    return 'input'
  }
  if (item.view_type === 'date') {
    if (item.options.range) {
      return 'range'
    }
  }
  return item.view_type;
}

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
  return opt
}

getTableConfig().then(response => {
  if (response.success) {

    console.log(response.data.id)
    table_id.value = response.data.id
    response.data.columns.forEach((item) => {
      columns.value.push({
        title: item.column_comment,
        formType: getFormViewType(item),
        dataIndex: item.column_name,
        addDisplay: item.is_insert === 2,
        editDisplay: item.is_edit === 2,
        hide: item.is_list === 1,
        search: item.is_query === 2,
        commonRules: item.is_required === 2 ? {
          required: true,
          message: "请输入" + item.column_comment
        } : null,
        dict: item.dict_type ? {
          name: item.dict_type,
          props: {
            label: "title",
            value: "key"
          },
          translation: true
        } : null,
        ...item.options
      })
    });
    let menus = []
    if (response.data.generate_menus) {
      menus = response.data.generate_menus.split(',');
    }

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
        auth: ['setting:autoform:' + table_id.value + ':save']
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
        auth: ['setting:autoform:' + table_id.value + ':update']
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
        auth: ['setting:autoform:' + table_id.value + ':delete'],
        realApi: (data) => {
          return request({
            url: 'setting/autoform/realDelete/' + response.data.id,
            method: 'delete',
            data
          })
        },
        realAuth: ['setting:autoform:' + table_id.value + ':realDeletes']
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
        auth: ['setting:autoform:' + table_id.value + ':recovery']
      },
      import: {
        show: false,
        url: 'autoform/import',
        templateUrl: 'test/crontab/downloadTemplate',
        auth: ['setting:autoform:' + table_id.value + ':import']
      },
      export: {
        show: false,
        url: 'autoform/export',
        auth: ['setting:autoform:' + table_id.value + ':export']
      }
    })

    configOK.value = true
  }
}).catch(err => {
  console.error(err)
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

const switchStatus = (statusValue, id, statusName) => {
  let data = {id, statusName, statusValue}
  request({
    url: 'setting/autoform/changeStatus/' + table_id.value,
    method: 'put',
    data
  }).then(res => {
    res.success && Message.success(res.message)
  }).catch(e => {
    console.log(e)
  })
}

</script>
<script> export default {name: 'test:crontab'} </script>