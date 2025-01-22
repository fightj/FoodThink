import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // define: {
  //   'import.meta.env.BASE_URL': '"/"', // ✅ 기본 URL 설정
  // },
})
