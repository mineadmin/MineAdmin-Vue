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
  <div class="inline-block">
    <a-input-group class="w-full">
      <a-trigger position="bottom" auto-fit-position :unmount-on-close="false">
        <a-input v-model="inputValue" placeholder="请点击左侧按钮选择资源" readonly />
        <template #content>
          <div class="trigger-content">
            <a-empty v-if="! list" />
            <a-image :src="inputValue" v-else-if="list && ! isArray(list)" />
            <div v-else>
              <a-image-preview-group infinite>
                <a-space>
                  <a-image :src="item" v-for="(item, index) in list" width="100%" :key="index" />
                </a-space>
              </a-image-preview-group>
            </div>
          </div>
        </template>
      </a-trigger>
      <a-button type="primary" @click="visible = true"><icon-experiment /> 资源选择器</a-button>
    </a-input-group>
    <a-modal v-model:visible="visible" :width="props.width" :footer="false"  draggable>
      <template #title>资源选择器</template>
      <ma-resource v-model="list" :multiple="props.multiple" :only-url="props.onlyUrl" />
    </a-modal>
  </div>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue'
  import { isArray } from 'lodash'

  const list = ref()
  const visible = ref(false)
  const inputValue = ref('')

  const emit = defineEmits(['update:modelValue'])

  const props = defineProps({
    modelValue: { type: [ String, Array ] },
    multiple: { type: Boolean, default: true },
    onlyUrl: { type: Boolean, default: true },
    width: { type: Number, default: 1080 },
  })

  onMounted(() => list.value = props.modelValue )

  watch(
    () => list.value,
    vl => {
      emit('update:modelValue', list.value)
      if ( props.multiple ) {
        inputValue.value = list.value.join(',')
      } else {
        inputValue.value = list.value
      }
      visible.value = false
    },
    { deep: true }
  )
</script>

<style scoped>
.trigger-content {
  margin-top: 1px;
  background: var(--color-fill-1);
  border: 1px solid var(--color-fill-3);
  width: 340px;
  border-radius: var(--border-radius-medium);
}
:deep(.arco-space) {
  display: block; margin-bottom: 5px;
}
</style>