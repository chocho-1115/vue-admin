<template>
  <router-view v-slot="{ Component, route }">
    <transition mode="out-in" name="fade-transform">
      <div>
        <keep-alive>
          <component :is="Component" :key="route.path" v-if="route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" :key="route.path" v-if="!route.meta.keepAlive" />
      </div>
    </transition>
  </router-view>
</template>
