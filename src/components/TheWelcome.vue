<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentation</template>
    Vue’s
    <a href="https://vuejs.org/" rel="noopener" target="_blank">official documentation</a>
    provides you with all information you need to get started.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Tooling</template>
    This project is served and bundled with
    <a href="https://vite.dev/guide/features.html" rel="noopener" target="_blank">Vite</a>. The
    recommended IDE setup is
    <a href="https://code.visualstudio.com/" rel="noopener" target="_blank">VSCode</a>
    +
    <a href="https://github.com/vuejs/language-tools" rel="noopener" target="_blank"
      >Vue - Official</a
    >. If you need to test your components and web pages, check out
    <a href="https://vitest.dev/" rel="noopener" target="_blank">Vitest</a>
    and
    <a href="https://www.cypress.io/" rel="noopener" target="_blank">Cypress</a>
    /
    <a href="https://playwright.dev/" rel="noopener" target="_blank">Playwright</a>
    .
    <br />More instructions are available in
    <a @click="openReadmeInEditor" href="javascript:void(0)"> <code>README.md</code> </a>.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Ecosystem</template>
    Get official tools and libraries for your project:
    <a href="https://pinia.vuejs.org/" rel="noopener" target="_blank">Pinia</a>,
    <a href="https://router.vuejs.org/" rel="noopener" target="_blank">Vue Router</a>,
    <a href="https://test-utils.vuejs.org/" rel="noopener" target="_blank">Vue Test Utils</a>, and
    <a href="https://github.com/vuejs/devtools" rel="noopener" target="_blank">Vue Dev Tools</a>. If
    you need more resources, we suggest paying
    <a href="https://github.com/vuejs/awesome-vue" rel="noopener" target="_blank">Awesome Vue</a>
    a visit.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>
    Got stuck? Ask your question on
    <a href="https://chat.vuejs.org" rel="noopener" target="_blank">Vue Land</a>
    (our official Discord server), or
    <a href="https://stackoverflow.com/questions/tagged/vue.js" rel="noopener" target="_blank"
      >StackOverflow</a
    >. You should also follow the official
    <a href="https://bsky.app/profile/vuejs.org" rel="noopener" target="_blank">@vuejs.org</a>
    Bluesky account or the
    <a href="https://x.com/vuejs" rel="noopener" target="_blank">@vuejs</a>
    X account for latest news in the Vue world.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>
    As an independent project, Vue relies on community backing for its sustainability. You can help
    us by
    <a href="https://vuejs.org/sponsor/" rel="noopener" target="_blank">becoming a sponsor</a>.
  </WelcomeItem>
</template>
