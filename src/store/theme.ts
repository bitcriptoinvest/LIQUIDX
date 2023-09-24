import { acceptHMRUpdate, defineStore } from 'pinia';

export type Theme = {
  theme: 'dark' | 'light';
};

export const useTheme = defineStore('theme', {
  state: (): Theme => ({
    theme: 'dark',
  }),
  actions: {
    setTheme(theme: 'dark' | 'light') {
      document.documentElement.classList.remove(this.theme);
      document.documentElement.classList.add(theme);
      this.theme = theme;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTheme, import.meta.hot));
}
