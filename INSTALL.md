# คู่มือการติดตั้งและใช้งาน — Prize Wheel App
# Installation & Setup Guide

---

## ความต้องการของระบบ / System Requirements

| รายการ | เวอร์ชันขั้นต่ำ |
|--------|----------------|
| Node.js | 18.x หรือสูงกว่า |
| npm | 9.x หรือสูงกว่า (มากับ Node.js) |
| เบราว์เซอร์ | Chrome 90+, Firefox 88+, Edge 90+, Safari 15+ |
| ระบบปฏิบัติการ | Windows 10/11, macOS 12+, Ubuntu 20.04+ |

ตรวจสอบเวอร์ชัน Node.js ที่ติดตั้งอยู่:
```bash
node -v
npm -v
```

---

## 1. ดาวน์โหลดโปรเจกต์ / Get the Project

### วิธีที่ 1 — Copy โฟลเดอร์โดยตรง
คัดลอกโฟลเดอร์ `prize-wheel-app` ไปวางในตำแหน่งที่ต้องการ

### วิธีที่ 2 — Clone จาก Git (ถ้ามี)
```bash
git clone <repository-url>
cd prize-wheel-app
```

---

## 2. ติดตั้ง Dependencies / Install Dependencies

เปิด Terminal หรือ Command Prompt แล้วรันคำสั่ง:

```bash
# เข้าไปในโฟลเดอร์โปรเจกต์
cd prize-wheel-app

# ติดตั้ง packages ทั้งหมด
npm install
```

การติดตั้งจะดาวน์โหลด packages ลงในโฟลเดอร์ `node_modules` (ใช้เวลาประมาณ 1–3 นาที ขึ้นอยู่กับความเร็วอินเทอร์เน็ต)

---

## 3. รันโปรแกรม (Development Mode) / Run the App

```bash
npm run dev
```

เมื่อสำเร็จจะแสดงผลประมาณนี้:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

เปิดเบราว์เซอร์แล้วไปที่ **http://localhost:5173**

> **หมายเหตุ**: ข้อมูลทั้งหมด (รางวัล, รายชื่อ, ประวัติ) บันทึกใน localStorage ของเบราว์เซอร์ ไม่มี server หรือ database

---

## 4. Build สำหรับ Production / Production Build

```bash
npm run build
```

ไฟล์ที่ build แล้วจะอยู่ในโฟลเดอร์ `dist/`

ทดสอบ production build ก่อน deploy:
```bash
npm run preview
```

---

## 5. รัน Test / Run Tests

```bash
# รัน tests ทั้งหมดครั้งเดียว
npm test

# รัน tests แบบ watch mode (auto re-run เมื่อแก้ไขไฟล์)
npm run test:watch

# รัน tests พร้อม coverage report
npm run test:coverage
```

ผลลัพธ์ที่คาดหวัง:
```
Test Files  9 passed (9)
     Tests  91 passed (91)
```

---

## 6. โครงสร้างโฟลเดอร์สำคัญ / Key Folder Structure

```
prize-wheel-app/
├── src/
│   ├── components/       # React components
│   ├── context/          # Global state (AppContext)
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Import/Export utilities
│   ├── constants/        # i18n strings (TH/EN)
│   └── __tests__/        # Test files
├── public/               # Static assets
├── dist/                 # Production build output
├── CLAUDE.md             # Project coding guidelines
├── INSTALL.md            # This file
└── package.json
```

---

## 7. การใช้งานเบื้องต้น / Quick Start Guide

### ขั้นตอนการใช้งาน
1. **เพิ่มรางวัล** — ไปที่แท็บ "รางวัล" → กดปุ่ม "+ เพิ่มรางวัล" → ใส่ชื่อรางวัลและจำนวน
2. **เพิ่มรายชื่อผู้เข้าร่วม** — ไปที่แท็บ "ผู้เข้าร่วม" → พิมพ์ชื่อทีละคน หรือนำเข้าจากไฟล์ .txt / .xlsx
3. **เลือกรางวัล** — บนหน้าวงล้อ ให้เลือกรางวัลจาก dropdown
4. **หมุนวงล้อ** — กดปุ่ม "หมุน!" เพื่อสุ่มผู้ได้รับรางวัล
5. **ยืนยันผู้ชนะ** — กด "ยืนยัน" เพื่อบันทึกผล หรือ "หมุนใหม่" เพื่อยกเลิก
6. **ดูประวัติ / Export** — ไปที่แท็บ "ประวัติ" เพื่อดูรายการและ export เป็น Excel หรือ PDF

### รูปแบบไฟล์ Import รายชื่อ
**ไฟล์ .txt**: หนึ่งชื่อต่อบรรทัด
```
สมชาย ใจดี
สมหญิง รักดี
วิชัย มานะ
```

**ไฟล์ .xlsx**: ชื่ออยู่ในคอลัมน์แรก (A) ของ Sheet แรก
| A |
|---|
| ชื่อ (header — ติ๊ก "ข้าม Row แรก") |
| สมชาย ใจดี |
| สมหญิง รักดี |

---

## 8. แก้ปัญหาที่พบบ่อย / Troubleshooting

### `npm install` ล้มเหลว
- ตรวจสอบว่า Node.js เวอร์ชัน 18+ ติดตั้งอยู่: `node -v`
- ลองลบ `node_modules` และ `package-lock.json` แล้วรัน `npm install` ใหม่:
  ```bash
  # Windows
  rmdir /s /q node_modules
  del package-lock.json
  npm install

  # macOS / Linux
  rm -rf node_modules package-lock.json
  npm install
  ```

### พอร์ต 5173 ถูกใช้อยู่แล้ว
Vite จะเปลี่ยนพอร์ตให้อัตโนมัติ (เช่น 5174) — ดูใน terminal output

### Export PDF ไม่เปิด
เบราว์เซอร์บล็อก popup — อนุญาต popup สำหรับ `localhost` ในการตั้งค่าเบราว์เซอร์

### ข้อมูลหาย หลัง clear cache
ข้อมูลเก็บใน localStorage ของเบราว์เซอร์ — การล้าง browser data จะลบข้อมูลออก แนะนำให้ export ก่อนทุกครั้ง

---

## 9. Scripts สรุป / Scripts Summary

| คำสั่ง | ทำอะไร |
|--------|---------|
| `npm run dev` | เปิด dev server ที่ localhost:5173 |
| `npm run build` | Build สำหรับ production (output → `dist/`) |
| `npm run preview` | Preview production build |
| `npm test` | รัน unit tests ทั้งหมด |
| `npm run test:watch` | รัน tests แบบ watch mode |
| `npm run test:coverage` | รัน tests + สร้าง coverage report |
