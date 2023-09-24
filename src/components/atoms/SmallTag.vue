<template>
  <span class="bg-slate-100 dark:bg-slate-700 py-[3px] px-2 rounded-md">
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SmallTag',
});
</script>
