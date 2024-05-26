<script setup>
import { isUndefined } from "lodash"
import dayjs from "dayjs"
import {discount} from "@/utils/common"

const props = defineProps({
  appList: Array,
  myAppList: Array,
  localInstallList: Object,
  isOnlyShowLocalApp: Boolean,
})

const emit = defineEmits(['onOpenDetail'])

const openDetailModal = (item) => {
  emit('onOpenDetail', item)
}

const checkInstallStatus = (space, identifier) => {
  const name = `${space}/${identifier}`
  return !isUndefined(props.localInstallList[name]) && props.localInstallList[name].status
}
</script>

<template>
  <div
      class="h-auto relative mt-8 sm:mt-0 border border-gray-150 dark:border-gray-600 hover:border-primary-500 dark:hover:border-gray-400 rounded-md top-0 hover:shadow-md hover:-top-1 dark:shadow-gray-600 transition-all duration-300 group overflow-hidden"
      v-for="(item, idx) in props.appList"
  >
    <div
        class="absolute z-10 w-auto bg-red-600 text-white px-5 origin-center rotate-45 -right-5 top-2.5"
        v-if="myAppList.includes(item.identifier) && ! props.isOnlyShowLocalApp"
    >
      已购买
    </div>
    <div
        class="absolute z-10 w-32 text-center bg-lime-600 text-white px-5 origin-center rotate-45 -right-7 top-6"
        v-if="checkInstallStatus(item.space, item.identifier) && ! props.isOnlyShowLocalApp"
    >
      已安装
    </div>
    <div
        class="absolute z-10 w-auto bg-green-600 text-white px-5 origin-center rotate-45 -right-6 top-3.5 text-sm"
        v-if="props.isOnlyShowLocalApp && ! isUndefined(props.localInstallList[`${item.space}/${item.identifier}`])"
    >
      本地应用
    </div>
    <a class="h-44 w-full" href="javascript:" @click="openDetailModal(item)">
      <div class="relative">
        <img
            class="!rounded-b-none !rounded-t-md pointer-events-none w-full object-cover sm:rounded-md h-48 transform transition-transform duration-200 group-hover:scale-105"
            :src="item.homepage[0]"
        />
        <div class="absolute bottom-2 right-2 space-x-2">
          <a-tag :color="tag.color === 'primary' ? 'arcoblue' : tag.color" v-for="tag in item.tags">{{ tag.name }}</a-tag>
        </div>
      </div>
    </a>
    <div class="p-3 pb-2">
      <div class="grid-cols-2 grid">
        <div class="text-sm">
          <a class="hover:underline" href="javascript:" @click="openDetailModal(item)">{{ item.name }}</a>
        </div>
        <div class="text-xs leading-5 text-gray-500 dark:text-gray-400 text-right">
          {{ `${dayjs(item.created_at).fromNow()}更新` }}
        </div>
      </div>
      <div class="text-xs mt-1 text-gray-500 dark:text-gray-400">
        {{ item.description }}
      </div>
      <div class="text-xs mt-5 grid grid-cols-2">
        <div class="leading-6 text-gray-700 dark:text-gray-300"><span class="hover:underline">X.Mo</span></div>
        <div class="text-right">
          <a-tag v-if="item.auth.type === 0" color="green">免费</a-tag>
          <div v-else-if="item.auth.type === 1">
            <div class="flex items-center justify-end leading-6">
              <div class="line-through text-gray-400" v-if="item.auth.integral_discount !== '0.00'">{{ item.auth.integral_quota }} 积分</div>
              <div class="ml-2 text-emerald-700">{{ discount(item.auth.integral_discount, item.auth.integral_quota) }} 积分</div>
            </div>
          </div>
          <div v-else-if="item.auth.type === 2">
            <div class="flex items-center justify-end leading-6">
              <div class="line-through text-gray-400" v-if="item.auth.basic_discount !== '0.00'">￥{{ item.auth.basic_quota }}</div>
              <div class="ml-2 text-blue-600">￥{{ discount(item.auth.basic_discount, item.auth.basic_quota) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>