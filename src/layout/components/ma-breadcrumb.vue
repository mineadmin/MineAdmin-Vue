<template>
  <div class="ml-2 mt-3.5 hidden lg:block">
    <a-breadcrumb>
      <a-breadcrumb-item class="cursor-pointer" @click="router.push('dashboard')">
        {{ $t('menus.dashboard') }}
      </a-breadcrumb-item>
      <template v-for="(r, index) in route.matched" :key="index">
        <a-breadcrumb-item
          v-if="index > 0 && !['/', '/home', '/dashboard'].includes(r.path)"
        >
          {{ $t(`menus.${r.name}`) }}
        </a-breadcrumb-item>
      </template>
    </a-breadcrumb>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
</script>
