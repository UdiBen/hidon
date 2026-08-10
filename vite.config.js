import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // Production is served from https://udiben.github.io/hidon/, so builds (and
  // `vite preview`, which must mirror them) need the repo prefix. Only the dev
  // server stays at the root, so `npm run dev` needs no path.
  base: command === 'serve' && !isPreview ? '/' : '/hidon/',
  plugins: [react()],
}))
