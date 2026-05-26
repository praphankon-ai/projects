import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 💡 แนะนำให้เอา base: '/prizeapp' ออก หรือเปลี่ยนเป็น '/' 
  // เพื่อให้ระบบสามารถเรียกไฟล์บนหน้าเว็บหลักของ Railway ได้ถูกต้อง
  base: '/',
  preview: {
    port: 4173,
    host: true,
    open: false,
    // 👇 แก้จาก 'all' มาระบุชื่อโดเมนของ Railway โดยตรงแบบนี้ครับ
    allowedHosts: [
      'projects-production-0da2.up.railway.app'
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: false,
  },
})
