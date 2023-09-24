import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: '#5090ea',
        secondary: '#ff00ff',
      },
    },
  },
  plugins: [require('windicss/plugin/forms')],
});
