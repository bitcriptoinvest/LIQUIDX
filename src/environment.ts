export const environment = {
  title: 'GRUUK',
  logo: '/images/logo.png',
  meta: {
    title: 'Buy GRUUK',
    description: 'GRUUK',
  },
  apiUrl: 'https://admin-ico.gruuk.com/api',
  presaleAddress: '0xB2299951e946C9AA940168961657B30ea693B679',
  symbol: 'GRK',
  networkMainToken: 'BNB',
  networkId: 56, // mainnet - 56
  rpcUrl: 'https://bsc-dataseed.binance.org',
  recaptchaV3SiteKey: 'GOOGLE CAPTCHA',
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  TOKEN_DECIMAL: 18,

  lockedToken: {
    id: 'GRK',
    image: '/images/logo.png',
    address: '0x1923692ea138e828f481b998f676be7dcd01361b',
    unit: 'ether',
  },

  tokens: [
    {
      id: 'BNB',
      name: 'Binance',
      address: undefined,
      image: '/images/tokens/bnb.svg',
      unit: 'ether',
    },
    {
      id: 'USDT',
      name: 'Binance-Peg BSC-USD',
      address: '0x55d398326f99059ff775485246999027b3197955',
      image: '/images/tokens/busdt_32.webp',
      unit: 'ether',
    },
    {
      id: 'BUSD',
      name: 'Binance-Peg BSC-USD (BSC-USD)',
      address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      image: '/images/tokens/busd_32.webp',
      unit: 'ether',
    },
    {
      id: 'USDC',
      name: 'Binance-Peg USD Coin',
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      image: '/images/tokens/centre-usdc_28.webp',
      unit: 'ether',
    },
  ],
};
