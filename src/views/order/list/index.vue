<script>
export default { name: 'order:' }
</script>
<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :crud="crud" :columns="columns" ref="crudRef"> </ma-crud>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import order from '@/api/order/order'
import tool from '@/utils/tool'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()

const numberOperation = (newValue, id, numberName) => {
  order
    .numberOperation({ id, numberName, numberValue: newValue })
    .then(res => {
      res.success && Message.success(res.message)
    })
    .catch(e => {
      console.log(e)
    })
}

const switchStatus = (statusValue, id, statusName) => {
  order
    .changeStatus({ id, statusName, statusValue })
    .then(res => {
      res.success && Message.success(res.message)
    })
    .catch(e => {
      console.log(e)
    })
}

const crud = reactive({
  rowSelection: {
    showCheckedAll: true,
  },
  searchLabelWidth: '75px',
  pk: 'id',
  api: order.getList,
  recycleApi: order.getRecycleList,
  add: {
    show: true,
    api: order.save,
    auth: ['order::save'],
  },
  edit: {
    show: true,
    api: order.update,
    auth: ['order::update'],
  },
  delete: {
    show: true,
    api: order.delete,
    auth: ['order::delete'],
    realApi: order.realDeletes,
    realAuth: ['order::realDeletes'],
  },
  recovery: {
    show: true,
    api: order.recoverys,
    auth: ['order::recovery'],
  },
})

const columns = reactive([
  {
    title: '订单ID',
    dataIndex: 'id',
    formType: 'input',
    hide: true,
  },
  {
    title: '用户ID',
    dataIndex: 'user_id',
    formType: 'input',
    hide: true,
  },
  {
    title: '商品ID',
    dataIndex: 'shop_id',
    formType: 'input',
    hide: true,
  },
  {
    title: '课程ID(套餐子类ID)',
    dataIndex: 'course_basis_id',
    formType: 'input',
    search: true,
  },
  {
    title: '商品名称',
    dataIndex: 'shop_name',
    formType: 'input',
    search: true,
  },
  {
    title: '课程名称(套餐子类课程名称)',
    dataIndex: 'course_name',
    formType: 'input',
    search: true,
  },
  {
    title: '订单编号(用户看,不可随意更改)',
    dataIndex: 'order_number',
    formType: 'input',
    hide: true,
  },
  {
    title: '支付编号 弃用(使用order_payments 支付单表)',
    dataIndex: 'pay_number',
    formType: 'input',
    hide: true,
  },
  {
    title: '商品类型:1:课程 2:充值积分 3:图书 4:文库 5:会员 6:面授 7:套餐 8:团购 9:续费',
    dataIndex: 'shop_type',
    formType: 'input',
    search: true,
  },
  {
    title:
      '支付类型:1:微信 2:支付宝 3:虚拟币支付 4:苹果支付 5:学习卡兑换 6:管理员赠送 7:易宝支付 8:优惠券支付 9:亲情卡 10:公益赠送',
    dataIndex: 'pay_type',
    formType: 'input',
    search: true,
  },
  {
    title: '订单金额',
    dataIndex: 'order_price',
    formType: 'input',
    search: true,
  },
  {
    title: '会员折扣金额',
    dataIndex: 'vip_discount',
    formType: 'input',
    search: true,
  },
  {
    title: '优惠券折扣金额',
    dataIndex: 'coupon_discount',
    formType: 'input',
    search: true,
  },
  {
    title: '其他折扣金额 拼团',
    dataIndex: 'other_discount',
    formType: 'input',
    search: true,
  },
  {
    title: '支付状态:1:未支付 2:已支付 3:已取消 4:已删除 5:退款中 6:已退款 7:已完成',
    dataIndex: 'pay_states',
    formType: 'input',
    hide: true,
  },
  {
    title: '发货状态 0无需发货 1待发货 2部分发货 3已发货 4已收货',
    dataIndex: 'ship_status',
    formType: 'input',
    search: true,
  },
  {
    title: '支付终端: 1:PC,2:安卓,3:IOS,4:H5,5:小程序,6:微信内置H5',
    dataIndex: 'tag_type',
    formType: 'input',
    search: true,
  },
  {
    title: '是否赠送:0:不是 1:是',
    dataIndex: 'is_present',
    formType: 'input',
    search: true,
  },
  {
    title: '是否发货:0:不发 1:发货',
    dataIndex: 'is_logistics',
    formType: 'input',
    search: true,
  },
  {
    title: '评论等级',
    dataIndex: 'grade',
    formType: 'input',
    search: true,
  },
  {
    title: '删除时间',
    dataIndex: 'deleted_at',
    formType: 'input',
    hide: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    formType: 'input',
    hide: true,
  },
  {
    title: '修改时间',
    dataIndex: 'updated_at',
    formType: 'input',
    hide: true,
  },
  {
    title: '有效期，单位天',
    dataIndex: 'indate',
    formType: 'input',
    search: true,
  },
  {
    title: '发货地址id',
    dataIndex: 'address_id',
    formType: 'input',
    search: true,
  },
  {
    title: '是否兑换 0不兑换 1.兑换',
    dataIndex: 'is_exchange',
    formType: 'input',
    search: true,
  },
  {
    title: '优惠券ID',
    dataIndex: 'coupon_id',
    formType: 'input',
    search: true,
  },
  {
    title: '订单备注',
    dataIndex: 'remark',
    formType: 'input',
    hide: true,
  },
  {
    title: '0不是拼团订单  >0 拼团活动ID',
    dataIndex: 'spell_id',
    formType: 'input',
    search: true,
  },
  {
    title: '团ID',
    dataIndex: 'group_id',
    formType: 'input',
    search: true,
  },
  {
    title: '班级id,未分班的id为0',
    dataIndex: 'class_grade_id',
    formType: 'input',
    search: true,
  },
  {
    title: '是否为线下支付 0:否1:是',
    dataIndex: 'is_offline',
    formType: 'input',
    search: true,
  },
  {
    title: '0=无效 1=有效 0暂停 1正常 2退费',
    dataIndex: 'status',
    formType: 'input',
    search: true,
  },
  {
    title: '',
    dataIndex: 'bug_subject',
    formType: 'input',
    search: true,
  },
  {
    title: '',
    dataIndex: 'bug_subject_name',
    formType: 'input',
    search: true,
  },
  {
    title: '有效期类型：0：只能看有效期范围内，1：未知，2：默认，3：有效期到期直播回放都不能看',
    dataIndex: 'indate_close',
    formType: 'input',
    search: true,
  },
  {
    title: '',
    dataIndex: 'audit_status',
    formType: 'input',
    search: true,
  },
  {
    title: '',
    dataIndex: 'update_indate',
    formType: 'input',
    search: true,
  },
  {
    title: '',
    dataIndex: 'is_renew',
    formType: 'input',
    search: true,
  },
  {
    title: '',
    dataIndex: 'activities',
    formType: 'input',
    search: true,
  },
  {
    title: '实际付款金额',
    dataIndex: 'actual_price',
    formType: 'input',
    search: true,
  },
  {
    title: '',
    dataIndex: 'created_name',
    formType: 'input',
    search: true,
  },
  {
    title: '',
    dataIndex: 'created_id',
    formType: 'input',
    search: true,
  },
  {
    title: '',
    dataIndex: 'cause_text',
    formType: 'input',
    search: true,
  },
  {
    title: '是否到期，1：到期',
    dataIndex: 'is_over',
    formType: 'input',
    search: true,
  },
  {
    title: '',
    dataIndex: 'renew_time',
    formType: 'input',
    search: true,
  },
  {
    title: '',
    dataIndex: 'status_time',
    formType: 'input',
    search: true,
  },
  {
    title: '退费时间',
    dataIndex: 'refund_time',
    formType: 'input',
    search: true,
  },
  {
    title: '2980续费关联主订单id',
    dataIndex: 'renew_order_id',
    formType: 'input',
    search: true,
  },
  {
    title: '1首月  2正价',
    dataIndex: 'apply_type',
    formType: 'input',
    search: true,
  },
  {
    title: '1:普通会员，2:超级会员，3:至尊会员',
    dataIndex: 'is_vip',
    formType: 'input',
    search: true,
  },
  {
    title: '用户平台',
    dataIndex: 'platform',
    formType: 'input',
    search: true,
  },
])
</script>
