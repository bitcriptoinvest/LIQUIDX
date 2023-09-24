<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
  color: {
    type: String,
    default: 'primary',
  },
});
const size = computed(() => (props.size === 'sm' ? 'px-2' : 'p-4'));
const color = computed(() => {
  if (props.color === 'success') {
    return 'text-green-600 dark:text-green-400 bg-green-400/10 hover:bg-green-400/20';
  } else if (props.color === 'danger') {
    return 'text-red-600 dark:text-red-400 bg-red-400/10 hover:bg-red-400/20';
  } else {
    return 'text-orange-600 dark:text-orange-400 bg-orange-400/10 hover:bg-orange-400/20';
  }
});
</script>

<template>
  <button
    type="button"
    :class="['font-bold rounded-lg', color, size]"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>
