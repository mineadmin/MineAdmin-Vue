<template>
  <ma-form-item
      v-if="(typeof props.component.display == 'undefined' || props.component.display === true)"
      :component="props.component"
      :custom-field="props.customField"
  >
    <slot :name="`form-${props.component.dataIndex}`" v-bind="props.component">
      <div style="flex: 1 1 auto;" class="arco-col arco-form-item-wrapper-col">
        <div class="add-spec">
          <a-button type="primary" :disabled="specification.length >= 5" @click="addSpec">添加规格</a-button>
        </div>

        <div style="margin-top: 10px;width: 100%;height: auto">
          <div class="specification">
            <ul class="spec-list" v-if="specification.length">
              <li class="item" v-for="(item, index) in specification" :key="index">
                <div class="name">
                  <a-input placeholder="输入产品规格" allow-clear v-model="item.name"/>
                  <i class="icon el-icon-circle-close" @click="delSpec(index)"></i>
                </div>
                <div class="values" style="display: flex">
                  <div style="margin-bottom: 5px;">
                   <span class="el-tag" v-for="(tag, num) in item.value" :key="tag" style="margin: 15px 5px;">
                      <a-tag closable @close="delSpecTag(index, num)">{{ tag }}</a-tag>
                  </span>
                  </div>

                  <div class="add-attr" style="margin: 0 0 0 5px">
                    <div style="display: flex;">
                      <a-input style="width: 120px" allow-clear size="small" v-model="addValues[index]" placeholder="请输入规格值"/>
                      <a-button type="primary" size="mini" @click="addSpecTag(index)" style="margin-left: 5px">确定</a-button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div  >
            <table  class="stock-table ">
              <thead>
              <tr>
                <th
                    v-for="(item, index) in specification"
                    :key="index">
                  {{ item.name }}
                </th>
                <th style="width: 160px;">规格编码</th>
                <th>成本价（元）</th>
                <th>库存</th>
                <th>销售价（元）</th>
                <th>是否启用</th>
              </tr>

              </thead>

              <tbody v-if="specification[0] && specification[0].value.length">
              <tr :key="index" v-for="(item, index) in countSum(0)">

                <template v-for="(n, specIndex) in specification.length">
                  <td
                      v-if="showTda(specIndex, index)"
                      :key="n"
                      :rowspan="countSum(n)"
                  >
                    {{getSpecAttr(specIndex, index)}}
                  </td>
                </template>

                <td>
                  <a-input
                      type="text"
                      :disabled="!childProductArray[index].isUse"
                      v-model="childProductArray[index].childProductNo"
                      @blur="handleNo(index)"
                      placeholder="输入商品规格编号"
                      allow-clear/>
                </td>
                <td>
                  <a-input
                      type="text"
                      v-model.number="childProductArray[index].childProductCost"
                      placeholder="输入成本价"
                      :disabled="!childProductArray[index].isUse"
                      allow-clear/>
                </td>
                <td>
                  <a-input
                      type="text"
                      v-model.number="childProductArray[index].childProductStock"
                      placeholder="输入库存"
                      :disabled="!childProductArray[index].isUse"
                      allow-clear/>
                </td>
                <td>
                  <a-input
                      type="text"
                      v-model.number="childProductArray[index].childProductPrice"
                      placeholder="输入销售价"
                      :disabled="!childProductArray[index].isUse"
                      allow-clear/>
                </td>
                <td>
                  <a-switch v-model="childProductArray[index].isUse" size="small" @change="(val) => {handleUserChange(index, val)}"/>
                </td>
              </tr>
              <tr>
                <td colspan="8" class="wh-foot">
                  <span class="label">批量设置：</span>
                  <ul class="set-list" v-if="isSetListShow">
                    <li class="set-item" @click="openBatch('childProductCost')">成本价</li>
                    <li class="set-item" @click="openBatch('childProductStock')">库存</li>
                    <li class="set-item" @click="openBatch('childProductPrice')">销售价</li>
                  </ul>
                  <div class="set-form" v-else>
                    <a-input-number v-model="batchValue"  placeholder="输入要设置的数量" class="input-demo" :min="1" :max="99999"/>
                    <a-button style="margin-right: 5px" type="primary" @click="setBatch" size="mini">确定</a-button>
                    <a-button type="primary" @click="cancelBatch" size="mini">取消</a-button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!--            <div class="example">-->
      <!--                <h4 class="title">数据格式</h4>-->
      <!--                <textarea class="code-area" :value="JSON.stringify(childProductArray)"></textarea>-->
      <!--            </div>-->


    </slot>
  </ma-form-item>
</template>

<script setup>
// 引入相关vue必要的api
import {inject, onMounted, reactive, ref, watch} from 'vue'
// 引入处理索引的函数
import {get, set} from 'lodash'
// 引入 MaFormItem 组件
import MaFormItem from './form-item.vue'
// 引入处理事件的函数
import { runEvent } from '../js/event.js'

// 组件都需要定义以下的props
const props = defineProps({
  component: Object,
  customField: { type: String, default: undefined }
})

// 该组件在form数据的索引名称
const index = props.customField ?? props.component.dataIndex

const formModel = inject('formModel')
const getColumnService= inject('getColumnService')
const columns = inject('columns')
const rv = async (ev, value = undefined) => await runEvent(props.component, ev, { formModel, getColumnService, columns }, value)

const value = ref(get(formModel.value, index))

// 规格
let specification = reactive([]);

let addValues = reactive([]);

let isSetListShow = ref(true);
let batchValue = ref(1);


let currentType = ref('');

let defaultProductNo = 'P_';

let childProductArray = reactive([]);

childProductArray = value.value && value.value.sku ? value.value.sku : reactive([]);
specification = value.value && value.value.spec ? value.value.spec : reactive([]);

onMounted(() => {
  return childProductArray.map(item => item.childProductSpec)
})

// 监听组件数据的改变
watch( () => addValues, vl => {
  value.value = vl

  let json = {
    sku: childProductArray,
    spec: specification
  }

  set(formModel.value, index, json)
} ,{immediate: true,deep: true})

watch( () => specification, v => {
  let json = {
    sku: childProductArray,
    spec: specification
  }

  set(formModel.value, index, json)

},{immediate: true,deep: true})

watch( () => childProductArray, v => {
  let json = {
    sku: childProductArray,
    spec: specification
  }

  set(formModel.value, index, json)
  // set(formModel.value, index, v)
},{immediate: true,deep: true})


// 打开设置框
function openBatch (type) {
  currentType.value = type
  isSetListShow.value = false
}


// 批量设置
function setBatch () {
  if (typeof batchValue.value === 'string') {
    alert("请输入正确的值")
    return
  }
  childProductArray.forEach(item => {
    if (item.isUse) {
      item[currentType.value] = batchValue.value
    }
  })

  cancelBatch()
}

// 取消批量设置
function cancelBatch () {
  batchValue.value = 1
  currentType.value = ''
  isSetListShow.value = true
}

// 监听规格启用操作
function handleUserChange (index, value) {
  // 启用规格时，生成不重复的商品编号；关闭规格时，清空商品编号
  if (value) {
    childProductArray[index].childProductNo = makeProductNoNotRepet(index);
  } else {
    childProductArray[index].childProductNo = '';
  }
}


// 监听商品编号的blur事件
function handleNo(index, attr) {
  // 1.当用户输入完商品编号时，判断是否重复，如有重复，则提示客户并自动修改为不重复的商品编号
  const value = childProductArray[index].childProductNo
  let isRepet

  childProductArray.forEach((item, i) => {
    if (item.childProductNo === value && i !== index) {
      isRepet = true
    }
  })

  if (isRepet) {
    alert('不允许输入重复的商品编号');

    childProductArray[index].childProductNo = makeProductNoNotRepet(index);
    // this.$set(this.childProductArray[index], 'childProductNo', this.)
  }
}

// 生成不重复的商品编号
function makeProductNoNotRepet(index) {
  let No
  let i = index
  let isRepet = true
  while (isRepet) {
    No = defaultProductNo + i
    isRepet = isProductNoRepet(No)
    i++
  }
  return No
}

// 商品编号判重
function isProductNoRepet(No) {
  const result = childProductArray.findIndex((item) => {
    return item.childProductNo === No
  })
  return result > -1
}

// 根据传入的条件，来判断是否显示该td
function showTda(specIndex, index) {

  // 如果当前项目下没有属性，则不显示
  if (!specification[specIndex]) {
    return false

    // 自己悟一下吧
  } else if (index % countSum(specIndex + 1) === 0) {
    return true
  } else {
    return false
  }
}

// 添加规格属性
function addSpecTag(index) {
  let str = addValues[index] || ''
  if (!str.trim()) return // 判空
  str = str.trim()
  let arr = str.split(/\s+/) // 使用空格分割成数组

  let newArr = specification[index].value.concat(arr)
  newArr = Array.from(new Set(newArr)) // 去重

  specification[index].value = newArr
  clearAddValues(index)
  handleSpecChange('add')
}


// 清空 addValues
function clearAddValues(index) {
  addValues[index] = '';
};


// 删除规格属性
function delSpecTag(index, num) {
  specification[index].value.splice(num, 1)

  handleSpecChange('del')
}

function addSpec() {
  if (specification.length < 5) {
    specification.push({
      name: '',
      value: []
    });
  }
}

function delSpec(index) {
  specification.splice(index, 1)
  handleSpecChange('del')
}


/**
 * [handleSpecChange 监听标签的变化,当添加标签时；求出每一行的hash id，再动态变更库存信息；当删除标签时，先清空已有库存信息，然后将原有库存信息暂存到stockCopy中，方便后面调用]
 * @param  {[string]} option ['add'|'del' 操作类型，添加或删除]
 * @return {[type]}        [description]
 */
function handleSpecChange(option) {
  const stockCopy = JSON.parse(JSON.stringify(childProductArray))
  if (option === 'del') {
    childProductArray = []
  }

  for (let i = 0; i < countSum(0); i++) {
    changeStock(option, i, stockCopy)
  }
}

// 获取childProductArray的childProductSpec属性
function getChildProductSpec(index) {
  let obj = {}
  specification.forEach((item, specIndex) => {
    obj[item.name] = getSpecAttr(specIndex, index)
  })
  return obj
}


/*
  根据传入的属性值，拿到相应规格的属性
  @params
    specIndex 规格项目在 advancedSpecification 中的序号
    index 所有属性在遍历时的序号
*/
function getSpecAttr(specIndex, index) {
  // 获取当前规格项目下的属性值
  const currentValues = specification[specIndex].value
  let indexCopy

  // 判断是否是最后一个规格项目
  if (specification[specIndex + 1] && specification[specIndex + 1].value.length) {
    indexCopy = index / countSum(specIndex + 1)
  } else {
    indexCopy = index
  }

  const i = Math.floor(indexCopy % currentValues.length)

  if (i.toString() !== 'NaN') {
    return currentValues[i]
  } else {
    return ''
  }
}

/**
 * [根据规格，动态改变库存相关信息]
 * @param  {[string]} option    ['add'|'del' 操作类型，添加或删除]
 * @param  {[array]} stockCopy [库存信息的拷贝]
 * @return {[type]}           [description]
 */
function changeStock(option, index, stockCopy) {
  let childProduct = {
    childProductId: 0,
    childProductSpec: getChildProductSpec(index),
    childProductNo: defaultProductNo + index,
    childProductStock: 0,
    childProductPrice: 0,
    childProductCost: 0,
    isUse: true
  }

  const spec = childProduct.childProductSpec
  if (option === 'add') {

    // 如果此id不存在，说明为新增属性，则向 childProductArray 中添加一条数据
    // if (stockSpecArr.value.findIndex((item) => objEquals(spec, item)) === -1) {
    childProductArray[index] = childProduct;
    // }
  } else if (option === 'del') {
    // 因为是删除操作，理论上所有数据都能从stockCopy中获取到
    let origin = ''
    stockCopy.forEach(item => {
      if (objEquals(spec, item.childProductSpec)) {
        origin = item
        return false
      }
    })
    childProductArray.push(origin || childProduct)
  }
}


function objEquals(aObj, bObj) {
  if (typeof aObj == 'object' && typeof bObj == 'object') {
    if (aObj.constructor == Array && bObj.constructor == Array) {
      return aObj.length == bObj.length && JSON.stringify(aObj) == JSON.stringify(bObj)
    } else {
      return Object.keys(aObj) == Object.keys(bObj)
          && Object.values(aObj) == Object.values(bObj)
    }
    return false
  } else {
    return aObj === bObj
  }
}

/*
  计算属性的乘积
  @params
    specIndex 规格项目在 advancedSpecification 中的序号
*/
function countSum(specIndex) {
  let num = 1
  specification.forEach((item, index) => {
    if (index >= specIndex && item.value.length) {
      num *= item.value.length
    }
  })
  return num
};

//

// 绑定组件事件
rv('onCreated')
onMounted(() => rv('onMounted'))

</script>

<script>
export default {
  name: "form-sku",
}
</script>

<style scoped>
.specification {
  display: inline-block;
  vertical-align: top;
  width: 100%;
}

.specification .spec-list {
  background-color: #fff;
  border: 1px solid #d8d8d8;
  padding: 10px;

  margin-bottom: 20px;
}

.specification .spec-list .item {
  margin-top: 5px;
}

.specification .spec-list .item:first-child {
  margin-top: 0;
}

.specification .spec-list .item .name {
  /*background: #f3f6fb;*/
  padding: 2px 8px;
  text-align: right;
  overflow: hidden;
  margin-bottom: 10px;
}

.specification .spec-list .item .name .icon {
  display: none;
  color: #929292;
  cursor: pointer;
}

.specification .spec-list .item .name .icon:hover {
  color: #880000;
}

.stock-table td,
.stock-table th {
  padding: 4px 10px;
  border-bottom: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
}

.stock-table th {
  line-height: 30px;
  background-color: #eef1f6;
}

.stock-table .wh-foot {
  line-height: 30px;
}
.stock-table .wh-foot .label {
  display: inline-block;
  vertical-align: top;
}
.stock-table .wh-foot .set-list {
  display: inline-block;
  vertical-align: top;
  font-size: 0;
}
.stock-table .wh-foot .set-list .set-item {
  display: inline-block;
  vertical-align: top;
  margin-left: 15px;
  font-size: 13px;
  cursor: pointer;
  color: #0088ee;
}
.stock-table .wh-foot .set-form {
  display: inline-block;
  margin-left: 10px;
}


</style>
