/* eslint-disable @typescript-eslint/no-explicit-any */
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useUser } from './user';

import presaleAbi from '../contracts/presaleAbi.json';
import tokenAbi from '../contracts/tokenAbi.json';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { useToast } from 'vue-toastification';
import { environment } from '../environment';
import { Token, useTokens } from './tokens';
import axios from 'axios';

export const useStore = defineStore('store', () => {
  const web3 = ref<any>(undefined);

  let provider: any = null;

  const presaleContract = ref<any>(undefined);

  const user = useUser();
  const { address, lockedBalance } = storeToRefs(user);
  const { tokens, priceFrom, priceTo } = storeToRefs(useTokens());

  const toast = useToast();

  const isConnected = ref(false);

  const loading = ref(false);

  const presaleEndTime = ref(0);

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: { [environment.networkId]: environment.rpcUrl },
        chainId: environment.networkId,
        qrcodeModalOptions: {
          mobileLinks: [
            'trust',
            'metamask',
            'rainbow',
            'argent',
            'imtoken',
            'pillar',
          ],
        },
      },
    },
  };

  const web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true, // optional
    providerOptions, // required
    theme: {
      background: 'rgb(39, 49, 56)',
      main: 'rgb(199, 199, 199)',
      secondary: 'rgb(136, 136, 136)',
      border: 'rgba(195, 195, 195, 0.14)',
      hover: 'rgb(16, 26, 32)',
    },
  });

  const checkNetwork = async () => {
    const networkId = await web3.value.eth.net.getId();

    if (environment.networkId !== networkId) {
      toast.error('Please switch to BSC Network');
      return false;
    }

    presaleContract.value = new web3.value.eth.Contract(
      presaleAbi as any,
      environment.presaleAddress
    );

    presaleEndTime.value = await presaleContract.value.methods
      .preSaleEndTime()
      .call();

    return true;
  };

  async function getAccount() {
    const accounts = await web3.value.eth.getAccounts();

    if (accounts && accounts.length > 0) address.value = accounts[0];

    if (!(await checkNetwork())) return;

    const netBalanceResourse = await web3.value.eth.getBalance(address.value);

    const netBalance = web3.value.utils.fromWei(netBalanceResourse);

    tokens.value.forEach(async (token) => {
      if (token.id === environment.networkMainToken) {
        token.balance = netBalance;
        const rateOfNativeCurrencyResponse = await presaleContract.value.methods
          .rate()
          .call();
        token.price = web3.value.utils.fromWei(rateOfNativeCurrencyResponse);
        // changeSelectFromToken(token.token);
        return;
      }

      const contract = new web3.value.eth.Contract(tokenAbi, token.address);
      const tokenBalance = await contract.methods
        .balanceOf(address.value)
        .call();
      token.balance = web3.value.utils.fromWei(tokenBalance, token.unit);

      const rateOfToken = await presaleContract.value.methods
        .tokenPrices(token.address)
        .call();

      token.price = web3.value.utils.fromWei(rateOfToken, token.unit);
    });

    tokens.value = [...tokens.value];

    fetchBuyersAmount();

    loading.value = false;
  }

  const connectWallet = async () => {
    loading.value = true;

    provider = await web3Modal.connect();

    if (provider) {
      try {
        web3.value = new Web3(provider);

        provider.on('accountsChanged', getAccount);

        provider.on('chainChanged', getAccount);

        const accounts = await web3.value.eth.getAccounts();

        address.value = accounts[0];

        if (address.value) isConnected.value = true;

        if (!(await checkNetwork())) return;

        await getAccount();
      } catch (e) {
        toast.error('Connect grant failed! Please login aagain');
      }
    }
  };

  const disconnectWallet = async () => {
    if (provider.close) {
      await provider.close();
      provider = null;
    }

    await web3Modal.clearCachedProvider();

    address.value = '';
    presaleEndTime.value = 0;
    priceFrom.value = '';
    priceTo.value = '';

    tokens.value.forEach((token) => {
      token.price = 0;
      token.balance = '0';
    });

    isConnected.value = false;
  };

  const fetchBuyersAmount = async () => {
    const contract = new web3.value.eth.Contract(
      tokenAbi,
      environment.lockedToken.address
    );
    const tokenBalance = await contract.methods.balanceOf(address.value).call();
    lockedBalance.value = web3.value.utils.fromWei(
      tokenBalance,
      environment.lockedToken.unit
    );
  };

  const buyToken = async (
    value: string | number,
    token: Token,
    presaleTokenAmount: string | number
  ) => {
    if (!+value) return;
    loading.value = true;
    try {
      const amount = web3.value.utils.toWei(value, token.unit);
      const walletName =
        web3Modal.cachedProvider === 'injected'
          ? 'metamask'
          : web3Modal.cachedProvider;

      const payload = {
        bought_amount: +presaleTokenAmount,
        spent_amount: +value,
        currency: '',
        transaction_hash: '',
        wallet_used: walletName,
        wallet_address: address.value,
      };

      if (token.id === environment.networkMainToken) {
        const response = await presaleContract.value.methods
          .buyToken(
            environment.ZERO_ADDRESS,
            '0'.repeat(environment.TOKEN_DECIMAL)
          )
          .send({
            from: address.value,
            value: amount,
          });
        // from, transactionHash

        payload.transaction_hash = response.transactionHash;
        payload.currency = environment.networkMainToken;
      } else {
        const tokenContract = new web3.value.eth.Contract(
          tokenAbi,
          token.address
        );

        const allowance = await tokenContract.methods
          .allowance(address.value, environment.presaleAddress)
          .call();

        if (!Number(allowance)) {
          await tokenContract.methods
            .approve(
              environment.presaleAddress,
              web3.value.utils.toWei('9999999999999999999999999999')
            )
            .send({ from: address.value });
          toast.success('Spend approved');
        }

        const response = await presaleContract.value.methods
          .buyToken(token.address, amount)
          .send({ from: address.value });

        payload.transaction_hash = response.transactionHash;
        payload.currency = token.id;
      }

      axios.post(`${environment.apiUrl}/purchase-successful`, payload);

      toast.success('You have successfully purchased $GRK Tokens. Thank you!');

      fetchBuyersAmount();

      tokens.value.forEach(async (token) => {
        if (token.id === environment.networkMainToken) {
          const netBalanceResponse = await web3.value.eth.getBalance(
            address.value
          );
          const netBalance = web3.value.utils.fromWei(netBalanceResponse);

          token.balance = netBalance;
          return;
        }
        const contract = new web3.value.eth.Contract(tokenAbi, token.address);
        const tokenBalance = await contract.methods
          .balanceOf(address.value)
          .call();

        const balance = web3.value.utils.fromWei(tokenBalance, token.unit);
        token.balance = balance;
      });
    } catch (error: any) {
      toast.error(error?.message || 'Signing failed, please try again!');
    }
    loading.value = false;
  };

  const unlockToken = async (amount: string) => {
    if (!+amount) return;
    loading.value = true;

    try {
      const netToken = tokens.value.find(
        (t) => t.id === environment.networkMainToken
      );
      const amountInNetToken = calculateParityToFrom(
        netToken?.price as string,
        amount
      );

      await presaleContract.value.methods.withdrawToken().send({
        from: address.value,
        value: web3.value.utils.toWei(amountInNetToken.toString()),
      });

      toast.success('Unlock was successful');
      fetchBuyersAmount();
    } catch (error) {
      toast.error('Signing failed, please try again!');
    }

    loading.value = false;
  };

  const calculateParityToFrom = (parityRate: string, value: string) => {
    if (!+parityRate || !+value) return 0;
    return Number.parseFloat(value) * Number.parseFloat(parityRate);
  };

  const calculateParityFromTo = (parityRate: string, value: string) => {
    if (!+parityRate || !+value) return 0;
    return Number.parseFloat(value) / Number.parseFloat(parityRate);
  };

  const addTokenAsset = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: environment.lockedToken.address,
            symbol: environment.lockedToken.id,
            decimals: 18,
          },
        },
      });
      toast.success('Token imported to metamask successfully');
    } catch (e) {
      toast.error('Token import failed');
    }
  };

  return {
    web3,
    provider,
    isConnected,
    loading,
    presaleEndTime,
    connectWallet,
    disconnectWallet,
    fetchBuyersAmount,
    buyToken,
    unlockToken,
    calculateParityToFrom,
    calculateParityFromTo,
    addTokenAsset,
  } as const;
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot));
}
