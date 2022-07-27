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
  <div>
    <a-input-group class="flex">
      <a-select
        placeholder="输入、下拉选择或点击右侧按钮选择"
        allow-search
        allow-clear
        v-model="currentIcon"
        @change="handlerChange"
      >
        <a-optgroup label="Arco Design">
          <a-option
            v-for="icon in arcodesignIcons"
            :key="icon"
            :value="icon"
            class="w-full"
          >
            <div class="flex justify-between items-center w-full">
              {{ icon }}
              <component :is="icon" />
            </div>
          </a-option>
        </a-optgroup>
        <a-optgroup label="MineAdmin">
          <a-option
            v-for="icon in mineadminIcons"
            :key="icon"
            :value="icon"
            class="w-full"
          >
            <div class="flex justify-between items-center w-full">
              {{ icon }}
              <component :is="icon" />
            </div>
          </a-option>
        </a-optgroup>
      </a-select>
      <div class="icon-container">
        <component :is="currentIcon" v-if="currentIcon" />
      </div>
      <a-button type="primary" @click="() => visible = true">选择图标</a-button>
    </a-input-group>

    <a-modal v-model:visible="visible" width="800px" draggable :footer="false">
      <template #title>选择图标</template>
      <a-tabs class="tabs">
        <a-tab-pane key="arco" title="Arco Design">
          <ul class="arco">
            <li
              v-for="icon in arcodesignIcons"
              :key="icon"
              @click="selectIcon(icon, 'arco')"
            >
              <component :is="icon" />
            </li>
          </ul>
        </a-tab-pane>
        <a-tab-pane key="mine" title="MineAdmin">
          <ul class="mine">
            <li
              v-for="icon in mineadminIcons"
              :key="icon"
              @click="selectIcon(icon, 'mine')"
            >
              <component :is="icon" />
            </li>
          </ul>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script setup>
  import { reactive, ref, onMounted } from 'vue'
  import * as arcoIcons from '@arco-design/web-vue/es/icon'
  import * as maIcons from '@/assets/ma-icons'

  const mineadminIcons = reactive([])
  const arcodesignIcons = reactive([])
  const visible = ref(false)
  const currentIcon = ref()

  const props = defineProps({
    modelValue: { type: String }
  })
  
  const emit = defineEmits(['update:modelValue'])

  onMounted( () => currentIcon.value = props.modelValue )

  for (let icon in arcoIcons) {
    arcodesignIcons.push(icon)
  }

  arcodesignIcons.pop()

  for (let icon in maIcons) {
    mineadminIcons.push(`ma-icon-${icon}`.toLowerCase())
  }

  const selectIcon = (icon, className) => {
    currentIcon.value = icon
    emit('update:modelValue', currentIcon.value)
    visible.value = false
  }

  const handlerChange = (value) => { 
    selectIcon(value, '')
  }
</script>

<style scoped lang="less">
.icon-container {
  width: 50px; height: 32px;
  background-color: var(--color-fill-1);
  display: flex; justify-content: center;
  align-items: center;
}

.icon {
  width: 1em; fill: var(--color-text-1);
}

.tabs {

  ul {
    display: flex; flex-wrap: wrap; padding-left: 7px;
  }

  li {
    border: 2px solid var(--color-fill-4); margin-bottom: 10px;
    margin-right: 6px; padding: 5px; cursor: pointer;
  }
  
  li:hover, li.active {
    border: 2px solid rgb(var(--primary-6));
  }

  & li svg {
    width: 2.4em; height: 2.4em;
  }
}
:deep(.arco-select-option-content) {
  width: 100%;
}
</style>