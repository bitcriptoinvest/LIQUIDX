<template>
  <header>
    <nav
      class="container mx-auto p-4 flex flex-wrap items-center justify-between xl:gap-5 gap-2"
    >
      <a
        href="https://gruuk.com/"
        class="flex items-center gap-3 w-auto xl:w-96"
      >
        <img :src="environment.logo" alt="logo" class="xl:h-12 h-8" />
        <p
          class="font-bold uppercase xl:text-3xl text-lg transition hover:text-orange-500"
        >
          {{ environment.title }}
        </p>
      </a>
      <vue-countdown
        v-if="presaleEndTime"
        v-slot="{ days, hours, minutes, seconds }"
        class="text-center flex-grow xl:order-none xl:mt-0 xl:w-auto w-full mt-4 order-last"
        :time="countdown"
      >
        <p class="text-center text-2xl mb-4">Presale Ends In</p>
        <div
          class="text-4xl text-center flex w-full items-center justify-center"
        >
          <div class="w-24 mx-1 p-2 bg-white dark:bg-[#271649] rounded-lg">
            <div class="font-mono leading-none">{{ days }}</div>
            <div class="font-mono uppercase text-sm leading-none">Days</div>
          </div>
          <div class="w-24 mx-1 p-2 bg-white dark:bg-[#271649] rounded-lg">
            <div class="font-mono leading-none">{{ hours }}</div>
            <div class="font-mono uppercase text-sm leading-none">Hours</div>
          </div>
          <div class="w-24 mx-1 p-2 bg-white dark:bg-[#271649] rounded-lg">
            <div class="font-mono leading-none">{{ minutes }}</div>
            <div class="font-mono uppercase text-sm leading-none">Minutes</div>
          </div>
          <div class="w-24 mx-1 p-2 bg-white dark:bg-[#271649] rounded-lg">
            <div class="font-mono leading-none">{{ seconds }}</div>
            <div class="font-mono uppercase text-sm leading-none">Seconds</div>
          </div>
        </div>
      </vue-countdown>
      <span v-else></span>
      <div class="flex flex-center justify-end w-auto xl:w-96">
        <a
          href="https://t.me/crypto_gruuk"
          target="_blank"
          class="mr-2 bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold p-2 rounded-lg flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400"
        >
          <img
            src="/images/telegram.svg"
            alt="telegram"
            class="h-5 text-white mx-2"
          />
          <span class="xl:block hidden">Chat Support</span>
        </a>
        <!-- <theme-toggle /> -->
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useStore } from '../../store';
import { storeToRefs } from 'pinia';
import VueCountdown from '@chenfengyuan/vue-countdown';
import { computed } from 'vue';
import { environment } from '../../environment';

const store = useStore();
const { presaleEndTime } = storeToRefs(store);
const countdown = computed(
  () => presaleEndTime.value * 1000 - new Date().getTime()
);
</script>
