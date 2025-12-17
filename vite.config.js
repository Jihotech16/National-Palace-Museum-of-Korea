import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    open: true
    // Vite는 기본적으로 모든 라우트를 index.html로 처리합니다 (SPA 라우팅 지원)
  }
})


