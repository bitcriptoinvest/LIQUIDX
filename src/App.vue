<template>
  <teleport to="head">
    <title>{{ title }}</title>
    <meta name="description" :content="description" />
    <meta name="og:title" :content="title" />
    <meta name="og:description" :content="description" />
    <meta name="og:image" :content="imageUrl" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" :content="title" />
    <meta name="twitter:description" :content="description" />
    <meta name="twitter:image" :content="imageUrl" />
  </teleport>
  <main class="flex flex-col justify-between min-h-screen">
    <AppHeader />
    <router-view></router-view>
    <div class="pb-5 w-full text-center">
      Copyright © {{ new Date().getFullYear() }}
      <a href="https://www.gruuk.com" class="hover:underline">
        www.gruuk.com
      </a>
      All rights reserved.
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AppHeader from './components/layout/AppHeader.vue';
import { environment } from './environment';
import { useTheme } from './store/theme';

export default defineComponent({
  name: 'App',
  components: {
    AppHeader,
  },
  data() {
    return {
      title: environment.meta.title,
      description: environment.meta.description,
      imageUrl: '/images/logo.png',
    };
  },
  mounted() {
    const { setTheme, theme } = useTheme();
    setTheme(theme);
  },
});
</script>

<style>
body {
  @apply antialiased bg-slate-100 dark:bg-[#160d2c] text-slate-900 dark:text-[#f3f4f6];
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url('/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
