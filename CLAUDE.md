# CLAUDE.md — Prize Wheel App

## Project Overview
React + Tailwind CSS web app สำหรับงาน Lucky Draw แบบ Spin-the-Wheel ไม่มี backend ทั้งหมดทำงานใน browser

## Tech Stack
- **React 18** (functional components, hooks only — ห้ามใช้ class components)
- **Vite** (dev server + build)
- **Tailwind CSS 3** (utility-first, ห้าม inline style ยกเว้น canvas / dynamic values)
- **xlsx** — import .xlsx participants, export winner report
- **jspdf + jspdf-autotable** — export PDF announcement
- **Web Audio API** (built-in, ไม่ใช้ library เสียง)

## Architecture

### State Management
- ใช้ React Context (`AppContext`) เป็น single source of truth
- ทุก state ที่ต้อง persist ใช้ `useLocalStorage` hook
- ห้าม useState แยกใน component สำหรับข้อมูล global (prizes, participants, history, lang)

### Data Models
```ts
Prize      = { id, nameTh, nameEn, totalQty, remainingQty, color }
Participant = { id, name, isEligible }
WinnerRecord = { id, prizeId, prizeNameTh, prizeNameEn, participantName, timestamp }
```

### i18n
- ข้อความ UI ทั้งหมดอยู่ใน `src/constants/i18n.js`
- Component รับ `lang` จาก Context แล้วใช้ `t[lang].keyName`
- ห้าม hardcode ข้อความภาษาไทย/อังกฤษใน JSX โดยตรง

## Coding Conventions

### File / Component Naming
- Components: `PascalCase.jsx`
- Hooks: `camelCase.js` เริ่มต้นด้วย `use`
- Utils: `camelCase.js`
- หนึ่งไฟล์ หนึ่ง export default component

### JSX Rules
- Props ที่เป็น boolean: เขียนแบบ `<Btn disabled />` ไม่ใช่ `<Btn disabled={true} />`
- Event handlers: ตั้งชื่อ `handleXxx` ใน component, `onXxx` เป็น prop name
- ห้ามใส่ logic ซับซ้อนใน JSX — แยกออกมาเป็น variable หรือ function ก่อน

### Tailwind
- ใช้ design tokens จาก `tailwind.config.js` (colors.brand, etc.)
- Responsive: mobile-first (`sm:` → `md:` → `lg:`)
- ห้าม `!important` หรือ `@apply` ยกเว้นใน `index.css` สำหรับ global base styles

### Comments
- เขียน comment เฉพาะ WHY ที่ไม่ชัดเจน — ไม่ต้องอธิบาย WHAT
- Canvas drawing code: comment section หลักได้ (เพราะอ่านยาก)

## File Structure
```
src/
  components/
    wheel/SpinWheel.jsx
    prize/PrizePanel.jsx
    prize/PrizeSelector.jsx
    participant/ParticipantPanel.jsx
    participant/ImportModal.jsx
    history/HistoryPanel.jsx
    ui/Modal.jsx
    ui/Button.jsx
    ui/LanguageToggle.jsx
  context/AppContext.jsx
  hooks/useLocalStorage.js
  hooks/useSound.js
  utils/exportExcel.js
  utils/exportPDF.js
  utils/importParticipants.js
  constants/i18n.js
  App.jsx
  main.jsx
docs/
  spec.md
```

## Key Behaviors
- **Wheel segments**: แสดงชื่อผู้เข้าร่วมที่ `isEligible === true` เท่านั้น
- **Prize removal**: เมื่อ `remainingQty === 0` ให้ซ่อนออกจาก PrizeSelector (ไม่ delete)
- **Duplicate import**: ชื่อซ้ำกับที่มีอยู่แล้วให้ skip (ไม่ error)
- **localStorage keys**: `pw_prizes`, `pw_participants`, `pw_history`, `pw_lang`, `pw_eventTitle`

## Do NOT
- ใช้ class components
- ใช้ Redux, Zustand หรือ external state library
- Hardcode ข้อความ UI ภาษาใดภาษาหนึ่งโดยตรงใน JSX
- ใช้ `any` หรือ skip prop validation แบบสิ้นเชิง
- สร้างไฟล์ documentation (.md) เพิ่มเติมนอกจากที่มีแล้ว ยกเว้น user ขอ
