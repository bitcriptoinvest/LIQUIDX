<template>
  <form
    class="grid gap-y-4 bg-white dark:bg-[#271649] w-lg max-w-full rounded-2xl py-4 px-6 shadow-lg mx-auto"
    @submit.prevent
  >
    <h2 class="mb-2 text-center font-bold text-2xl">
      Buy {{ environment.lockedToken.id }} Token
    </h2>
    <template v-if="isConnected">
      <div class="truncate">
        <p class="font-bold mb-1">Address</p>
        <small-tag class="truncate cursor-pointer" @click="copyAddress">
          {{ address }}
        </small-tag>
      </div>

      <div class="flex justify-between flex-wrap gap-3">
        <div>
          <p class="font-bold mb-1">{{ environment.lockedToken.id }} Balance</p>
          <small-tag
            >{{ formatNumber(lockedBalance) }}
            {{ environment.lockedToken.id }}</small-tag
          >
        </div>
        <div class="lg:text-right">
          <p class="font-bold mb-1">Your Balance</p>
          <small-tag>
            {{ formatNumber(tokenFrom.balance) || 0 }} {{ tokenFrom.id }}
          </small-tag>
        </div>
      </div>
    </template>
    <div
      class="relative grid grid-cols-[minmax(min-content,100px),minmax(auto,1fr),minmax(min-content,100px)] gap-x-4"
    >
      <token-selector
        :token-selected="tokenFrom"
        @selected-token="updateToken('setTokenFrom', $event)"
      />
      <token-input
        :key="`${balanceFrom}-${tokenFrom?.id}`"
        v-model="priceFrom"
        :balance="balanceFrom"
        :readonly="!isConnected"
      />
      <div class="justify-end items-end w-full flex gap-1 mb-2">
        <base-button size="sm" @click="setBalance(0.5)">50%</base-button>
        <base-button size="sm" @click="setBalance(1)">Max</base-button>
      </div>
    </div>
    <div class="flex w-full items-center">
      <span class="flex-auto bg-orange-200 h-px"></span>
    </div>
    <div
      class="relative grid grid-cols-[minmax(max-content,100px),minmax(auto,1fr)] gap-4"
    >
      <div class="flex flex-wrap items-center gap-x-2">
        <img
          :src="environment.lockedToken.image"
          :alt="`${environment.lockedToken.id} logo`"
          width="40"
          height="40"
          class="bg-white rounded-full w-7 h-7 p-1"
          loading="lazy"
        />
        {{ environment.lockedToken.id }}
      </div>
      <token-input
        :key="`token-input-${tokenTo?.id}`"
        :model-value="priceTo"
        :readonly="true"
      />
      <p
        v-if="tokenFrom.price"
        class="col-span-2 text-xs flex items-center gap-2"
      >
        Price :
        <small-tag v-if="tokenFrom">{{
          `1 ${environment.lockedToken.id} = ${tokenFrom?.price} ${tokenFrom?.id}`
        }}</small-tag>
        <small-tag v-else>-</small-tag>
      </p>
    </div>
    <div v-if="isConnected && isValidWallet" class="flex items-center">
      <input
        id="default-checkbox"
        v-model="isAgree"
        :value="true"
        type="checkbox"
        class="w-4 h-4 text-orange-600 bg-gray-100 rounded border-gray-300 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        for="default-checkbox"
        class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        I have read and agree to the
        <a href="https://gruuk.com/terms" target="_blank" class="underline"
          >Terms & Conditions</a
        >
        and
        <a
          href="https://gruuk.com/privacy-policy"
          target="_blank"
          class="underline"
          >Privacy Policy</a
        >
      </label>
    </div>
    <button
      v-if="isConnected ? isValidWallet : true"
      type="submit"
      class="button-submit text-orange-600 dark:text-orange-400 bg-orange-400/10 hover:bg-orange-400/20 w-full p-4 font-bold rounded-lg"
      :disabled="isConnected ? !isAgree : loading"
      @click="submit"
    >
      {{
        loading
          ? 'Proccessing...'
          : isConnected
          ? 'Buy Token'
          : 'Connect Wallet'
      }}
    </button>
    <a
      v-else
      href="https://wallet.gruuk.com/register"
      class="text-center text-orange-600 dark:text-orange-400 bg-orange-400/10 hover:bg-orange-400/20 w-full p-4 font-bold rounded-lg"
    >
      Enable KYC (Know Your Customer) Form
    </a>

    <button
      v-if="isConnected"
      class="p-2 text-red-400 hover:underline"
      @click="store.disconnectWallet()"
    >
      Disconnect
    </button>
  </form>
  <div class="grid gap-y-4 w-lg max-w-full py-10 px-6 mx-auto">
    <button
      class="text-green-600 dark:text-green-400 hover:underline font-bold rounded-lg flex justify-center gap-2 items-center"
      @click="store.addTokenAsset"
    >
      <img
        src="/images/metamask.svg"
        class="h-6 cursor-pointer"
        alt="Import token to metamask"
        title="Import token to metamask"
      />
      Import GRUUK Token to Metamask
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref, watch } from 'vue';
import BigNumber from 'bignumber.js';
import { Token, useTokens } from '../../store/tokens';
import SmallTag from '../atoms/SmallTag.vue';
import TokenInput from '../atoms/TokenInput.vue';
import TokenSelector from '../molecules/TokenSelector.vue';
import { storeToRefs } from 'pinia';
import { useUser } from '../../store/user';
import { environment } from '../../environment';
import { useStore } from '../../store';
import BaseButton from '../BaseButton.vue';
import { useClipboard } from '@vueuse/core';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';

BigNumber.config({ EXPONENTIAL_AT: [-20, 20] });

const toast = useToast();
const store = useStore();
const { isConnected, loading } = storeToRefs(store);

const { setTokenFrom, setTokenTo } = useTokens();

const { priceTo, tokenTo, priceFrom, tokenFrom } = storeToRefs(useTokens());

const { lockedBalance, address } = storeToRefs(useUser());

const isAgree = ref(false);

const route = useRoute();

const isValidWallet = computed(() => {
  const wallet = route.query.wallet as string;
  console.log(address.value, wallet);
  return address.value?.toLowerCase() === wallet?.toLowerCase();
});

const copyAddress = () => {
  const { copy, copied } = useClipboard({ source: address });
  copy();
  if (copied) toast.success('Address copied!');
};

const balanceFrom: ComputedRef<string> = computed(
  () => tokenFrom.value?.balance
);

watch(priceFrom, (val) => {
  priceTo.value = store.calculateParityFromTo(
    tokenFrom.value.price,
    val as string
  );
});

const setBalance = (val: number) => {
  if (!tokenFrom.value.balance) return '0';
  priceFrom.value = (tokenFrom.value.balance * val).toString();
};

const submit = () => {
  if (!isConnected.value) {
    store.connectWallet();
  } else {
    store.buyToken(priceFrom.value, tokenFrom.value as Token, priceTo.value);
  }
};

const updateToken = (action: string, token: Token) => {
  if (action === 'setTokenFrom') {
    setTokenFrom(token);
  } else if (action === 'setTokenTo') {
    setTokenTo(token);
  }
};

const formatNumber = (num: string | number) => {
  return +Number(num).toFixed(6);
};
</script>

<style scoped>
.button-submit:disabled {
  @apply bg-gray-700 text-white cursor-not-allowed;
}
</style>
