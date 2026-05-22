---
name: spin-review
description: ตรวจสอบ wheel logic และ animation ว่าทำงานถูกต้อง — ใช้เมื่อแก้ไข SpinWheel.jsx หรือ AppContext spin flow
tools:
  - Read
  - Grep
  - Bash
---

# spin-review

ตรวจสอบ 4 จุดหลักของ spin logic:

1. **Segment calculation** — `src/components/wheel/SpinWheel.jsx`
   - ตรวจว่า eligible participants ถูกแบ่ง segment เท่ากันทุกคน
   - ตรวจว่า winner index คำนวณจาก final rotation angle ถูกต้อง

2. **State mutation** — `src/context/AppContext.jsx` ฟังก์ชัน `confirmWinner`
   - participant ที่ชนะต้อง set `isEligible = false`
   - prize ที่เลือกต้อง `remainingQty--`
   - ถ้า `remainingQty === 0` ต้องไม่ปรากฏใน PrizeSelector

3. **Sound timing** — `src/hooks/useSound.js`
   - spin sound เริ่มเมื่อ animation เริ่ม
   - win sound เล่นเมื่อ wheel หยุดและ winner ถูก highlight

4. **History record** — ตรวจว่า WinnerRecord ถูก push เข้า history หลัง confirm เท่านั้น (ไม่ใช่หลัง spin)

รายงานผลเป็น checklist: ✅ pass / ❌ fail พร้อม file:line

---
name: export-test
description: ทดสอบ export Excel และ PDF — ใช้เมื่อแก้ไข exportExcel.js หรือ exportPDF.js
tools:
  - Read
  - Bash
---

# export-test

ตรวจสอบ export utils:

1. **Excel** — `src/utils/exportExcel.js`
   - columns: No., Prize (TH), Prize (EN), Winner Name, Date/Time
   - ไฟล์ชื่อ `winner-report-YYYY-MM-DD.xlsx`
   - header row ต้อง bold

2. **PDF** — `src/utils/exportPDF.js`
   - มี event title ด้านบน
   - ตาราง autoTable มี columns เดียวกับ Excel
   - font รองรับภาษาไทย (ใช้ embedded font หรือ fallback ที่ระบุใน spec)

3. **Edge cases**
   - history ว่างเปล่า → ไม่ export / แสดง toast แจ้งเตือน
   - ชื่อภาษาไทยใน PDF ต้องไม่แสดงเป็น box/tofu

รายงานผลเป็น checklist: ✅ pass / ❌ fail พร้อม file:line
