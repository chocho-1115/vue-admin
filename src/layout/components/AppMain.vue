<template>
  <router-view v-slot="{ Component, route }">
    <transition mode="out-in" name="fade-transform">
      <KeepAlive :include="keepAliveNames">
        <component :is="Component" :key="route.path" />
      </KeepAlive>
    </transition>
  </router-view>
</template>

<script setup>
import keepAliveNames from '@/router/keepAliveNames'
</script>