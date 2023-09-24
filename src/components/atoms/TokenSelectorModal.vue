<template>
  <div
    class="fixed z-4 inset-0 bg-slate-500 bg-opacity-50 pt-16 px-4"
    @click="clickOutside"
  >
    <ul
      ref="tokenSelectorDialog"
      class="max-h-[80vh] overflow-y-auto w-lg max-w-full bg-white dark:bg-slate-500 rounded-2xl shadow-lg mx-auto py-4"
    >
      <li class="pb-4">
        <button class="block ml-auto px-4 group" @click="$emit('closeModal')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="modal-close-icon group-hover:bg-slate-700 group-hover:text-slate-200 dark:group-hover:bg-slate-200 dark:group-hover:text-slate-900"
            viewBox="0 0 512 512"
          >
            <title>Close modal</title>
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M368 368L144 144M368 144L144 368"
            />
          </svg>
        </button>
      </li>
      <li
        v-for="token in tokens"
        :key="`crypto-token-${token.id}`"
        class="modal-token-item"
        :class="{
          disabled: tokenFrom?.id === token.id || tokenTo?.id === token.id,
        }"
        @click="sendSelectedToken(token)"
      >
        <img
          :src="token.image"
          :alt="`${token.id} logo`"
          width="40"
          height="40"
          class="bg-white rounded-full w-10 h-10 p-1"
          loading="lazy"
        />
        <p class="flex flex-col font-medium">
          {{ token.id }}
          <span class="modal-token-name">{{ token.name }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { Token, useTokens } from '../../store/tokens';
const emit = defineEmits(['closeModal', 'selectedToken']);

const tokenSelectorDialog = ref<HTMLElement>();
const { tokens, tokenFrom, tokenTo } = storeToRefs(useTokens());

const clickOutside = (event: Event): void => {
  const childElement = tokenSelectorDialog.value;
  if (
    event.target instanceof HTMLElement &&
    !childElement?.contains(event.target)
  ) {
    emit('closeModal');
  }
};

const sendSelectedToken = (token: Token): void => {
  emit('selectedToken', token);
};
</script>

<style scoped>
.modal-close-icon {
  @apply w-6 h-6 border border-slate-900 dark:border-slate-200 rounded-full transition duration-300;
}
.modal-token-item {
  @apply grid grid-cols-[40px,minmax(auto,1fr)] items-center py-2 px-6 gap-x-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 hover:bg-opacity-70;
}
.modal-token-item.disabled {
  @apply pointer-events-none opacity-50 hover:bg-transparent;
}
.modal-token-name {
  @apply font-light text-xs text-slate-500 dark:text-slate-200;
}
</style>
