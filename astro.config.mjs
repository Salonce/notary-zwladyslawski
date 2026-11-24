// @ts-check
/// <reference types="node" />

import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const isDemo = process.env.DEPLOY_TARGET === 'github';

export default defineConfig({
  site: isDemo
    ? 'https://salonce.github.io'
    : 'https://notariusz.wladyslawski.pl',

  base: isDemo ? '/notary-zwladyslawski' : '/',

  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()]
  }
});