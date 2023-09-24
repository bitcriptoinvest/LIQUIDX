/* eslint-disable @typescript-eslint/no-explicit-any */

import { acceptHMRUpdate, defineStore } from 'pinia';
import { environment } from '../environment';

export type Token = {
  id: string;
  name: string;
  address: string | undefined;
  image: string;
  balance?: number | string;
  price?: number | string;
  unit?: number;
};

export type Pool = {
  poolId: number;
  tokenA: string;
  tokenB: string;
  price: number;
};

export type Tokens = {
  tokenFrom: Token | any;
  tokenTo: Token | any;
  priceFrom: string | number;
  priceTo: string | number;
  tokens: Token[];
  pools: Pool[];
};

export const useTokens = defineStore('tokens', {
  state: (): Tokens => ({
    tokenFrom: environment.tokens[0],
    tokenTo: undefined,
    priceFrom: '',
    priceTo: '',
    tokens: environment.tokens,
    pools: [],
  }),
  getters: {
    getPoolByTokens:
      (state) =>
      (tokenFrom: string, tokenTo: string): Pool | undefined => {
        const comparePoolTokens = (token: string, pool: Pool): boolean =>
          pool.tokenA === token || pool.tokenB === token;
        return state.pools.find(
          (pool) =>
            comparePoolTokens(tokenFrom, pool) &&
            comparePoolTokens(tokenTo, pool)
        );
      },
  },
  actions: {
    setTokenFrom(tokenFrom: Token) {
      this.tokenFrom = tokenFrom;
    },
    setTokenTo(tokenTo: Token) {
      this.tokenTo = tokenTo;
    },
    setPriceFrom(priceFrom: string) {
      this.priceFrom = priceFrom;
    },
    setPriceTo(priceTo: string) {
      this.priceTo = priceTo;
    },
    async getTokens() {
      const response = await fetch(new Request('/data/tokens.json'));
      const { tokens } = await response.json();
      this.setTokens(tokens);
      this.setTokenFrom(tokens[0]);
    },
    async getPools() {
      const response = await fetch(new Request('/data/pools.json'));
      const { pools } = await response.json();
      this.setPools(pools);
    },
    setTokens(tokens: Token[]) {
      this.tokens = tokens;
    },
    setPools(pools: Pool[]) {
      this.pools = pools;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTokens, import.meta.hot));
}
