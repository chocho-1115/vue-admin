<template>
	<router-view v-slot="{ Component, route }">
		<!--
			Note: <transition> requires the routed page to render a single root element.
			If the routed component has multiple root nodes (fragment), the transition animation will not work.
			Among "<transition> out-in animation", "multi-root elements" and "KeepAlive caching",
			only two can hold at the same time — a Vue design constraint.
		-->
		<transition mode="out-in" name="fade-transform">
			<KeepAlive :include="keepAliveNames">
				<component :is="Component" :key="route.path" />
			</KeepAlive>
		</transition>
	</router-view>
</template>

<script setup>
import { keepAliveNames } from "@/router/config"
</script>
