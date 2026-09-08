import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';import tailwind from '@tailwindcss/vite';import path from 'node:path';
export default defineConfig({root:path.resolve('apps/docs'),base:'./',plugins:[react(),tailwind()],resolve:{dedupe:['react','react-dom','react-hook-form','@tanstack/react-form','@formisch/react','valibot','radix-ui','react-day-picker','lucide-react']},server:{host:'127.0.0.1',port:4175,strictPort:true,fs:{allow:[path.resolve('.')]}},build:{outDir:path.resolve('dist/docs'),emptyOutDir:true}});

