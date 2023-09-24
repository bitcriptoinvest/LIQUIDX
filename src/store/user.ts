import { acceptHMRUpdate, defineStore } from 'pinia';

type Balance = {
  token: string;
  balance: string;
};

export type User = {
  address: string;
  balances: Balance[];
  lockedBalance: number;
};

export const useUser = defineStore('user', {
  state: (): User => ({
    address: '',
    balances: [],
    lockedBalance: 0,
  }),
  getters: {
    getBalanceByToken:
      (state) =>
      (tokenId: string): string => {
        return (
          state.balances.find((balance) => balance.token === tokenId)
            ?.balance ?? '0'
        );
      },
  },
  actions: {
    async getBalances() {
      const response = await fetch(new Request('/data/balances.json'));
      const { balances } = await response.json();
      this.setBalance(balances);
    },
    setAddress(address: string) {
      this.address = address;
    },
    setBalance(balances: Balance[]) {
      this.balances = balances;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot));
}
