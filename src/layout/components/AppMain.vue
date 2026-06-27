<template>
  <router-view v-slot="{ Component, route }">

    <transition mode="out-in" name="fade-transform">
      <keep-alive>
        <component :is="Component" :key="route.path" v-if="route.meta.keepAlive" />
      </keep-alive>
    </transition>

    <transition mode="out-in" name="fade-transform">
      <component 
        :is="Component" 
        :key="route.path" 
        v-if="!route.meta.keepAlive" 
      />
    </transition>

  </router-view>
</template>

