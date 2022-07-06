<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<template>
  <a-modal v-model:visible="visible" @cancel="close">
    <template #title>菜单权限</template>
    <a-form :model="form">
      <a-form-item label="角色名称" field="name">
        <a-input disabled v-model="form.name" />
      </a-form-item>
      <a-form-item label="角色标识" field="code">
        <a-input disabled v-model="form.code" />
      </a-form-item>
      <a-form-item label="菜单列表" field="menu_ids">
        <a-spin :loading="loading" tip="菜单加载中..." class="w-full">
          <div class="w-full">
            <a-tree
              :data="menuList"
              :field-names="{ title: 'label', key: 'id' }"
            />
          </div>
        </a-spin>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
  import { ref } from 'vue'
  import role from '@/api/system/role'
  import menu from '@/api/system/menu'

  const visible = ref(false)
  const loading = ref(true)
  const menuList = ref([])
  const form = ref({ name: undefined, code: undefined })

  const open = (row) => {
    form.value = { id: row.id, name: row.name, code: row.code }
    setData(row.id)
    visible.value = true
  }

  const setData = (roleId) => {
    menu.tree().then(res => menuList.value = res.data )
    // role.getMenuByRole(roleId).then(res => {
      
    // })
    loading.value = false
  }

  const close = () => visible.value = false

  defineExpose({ open })
</script>