<template>
  <div>
    <a-input-group class="flex">
      <a-select
        placeholder="输入、下拉选择或点击右侧按钮选择"
        allow-search
        allow-clear
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
        <icon-stop />
      </div>
      <a-button type="primary">选择图标</a-button>
    </a-input-group>

    <a-modal>
      <template #title>选择图标</template>
    </a-modal>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import * as arcoIcons from '@arco-design/web-vue/es/icon'
  import * as maIcons from '@/assets/ma-icons'

  const mineadminIcons = reactive([])
  const arcodesignIcons = reactive([])

  for (let icon in arcoIcons) {
    arcodesignIcons.push(icon)
  }

  for (let icon in maIcons) {
    mineadminIcons.push(`ma-icon-${icon}`.toLowerCase())
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

:deep(.arco-select-option-content) {
  width: 100%;
}
</style>