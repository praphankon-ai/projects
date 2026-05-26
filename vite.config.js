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
    // 👇 เพิ่มส่วนนี้เข้าไปเพื่อแก้ปัญหา Blocked request ครับ
    allowedHosts: 'all'
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: false,
  },
})
