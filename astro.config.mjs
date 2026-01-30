import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://my-fi.ca',
  build: {
    assets: 'assets'
  },
  compressHTML: true
});
