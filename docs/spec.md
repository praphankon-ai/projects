# Prize Wheel App — Feature Specification

**Version:** 1.0  
**Date:** 2026-05-21  
**Stack:** React 18 + Tailwind CSS 3 + Vite (no backend)

---

## 1. Overview

เว็บแอปสุ่มแจกรางวัลสำหรับงาน Event โดยใช้วงล้อหมุน ผู้ดำเนินงาน (admin) เลือกรางวัลที่จะสุ่มก่อน จากนั้นหมุนวงล้อที่แสดงชื่อผู้มีสิทธิ์ทั้งหมด และระบบจะสุ่มผู้ชนะพร้อมตัดชื่อออกจากการสุ่มครั้งต่อไป

---

## 2. User Roles

ระบบนี้ไม่มี authentication — ผู้ใช้ทุกคนที่เปิด URL คือ "admin" ที่มีสิทธิ์ทำทุกอย่าง

---

## 3. Features

### 3.1 Prize Management (จัดการรางวัล)

**หน้าจอ:** Panel ด้านซ้ายหรือ tab "รางวัล"

| Field | Type | Required | Description |
|---|---|---|---|
| nameTh | string | ✅ | ชื่อรางวัลภาษาไทย |
| nameEn | string | ✅ | ชื่อรางวัลภาษาอังกฤษ |
| totalQty | integer ≥ 1 | ✅ | จำนวนรางวัลทั้งหมด |
| color | hex string | auto | สีของ segment บนวงล้อ (auto-assign จาก palette) |

**Actions:**
- เพิ่มรางวัล (form แบบ inline หรือ modal)
- แก้ไข nameTh, nameEn, totalQty
- ลบรางวัล (confirm dialog ก่อนลบ)

**Constraints:**
- เมื่อ `remainingQty === 0` รางวัลนั้นจะถูกซ่อนจาก PrizeSelector แต่ยังแสดงในรายการพร้อม badge "หมดแล้ว"
- `remainingQty` เริ่มต้นเท่ากับ `totalQty` เมื่อสร้างใหม่
- แก้ไข `totalQty` หลังสร้างแล้ว: `remainingQty` ปรับตามส่วนต่าง (เพิ่ม/ลด relative)

---

### 3.2 Participant Management (จัดการรายชื่อ)

**หน้าจอ:** Panel ด้านซ้ายหรือ tab "ผู้เข้าร่วม"

**Fields:**
- `name` (string) — ชื่อ-นามสกุล หรือรหัสพนักงาน

**Actions:**
- เพิ่มรายชื่อทีละคน (input + Enter)
- ลบรายชื่อ (ปุ่ม X)
- Import จากไฟล์ (ดูข้อ 3.2.1)
- Reset รายชื่อทั้งหมด (ล้าง list พร้อม confirm)

**States:**
- `isEligible: true` — มีสิทธิ์ได้รับรางวัล (แสดงบนวงล้อ)
- `isEligible: false` — ได้รับรางวัลแล้ว (แสดงใน list พร้อม badge "ได้รับรางวัลแล้ว")

#### 3.2.1 Import Participants

รองรับไฟล์ 2 ประเภท:

**Text (.txt)**
- encoding: UTF-8
- format: ชื่อ 1 คนต่อ 1 บรรทัด
- บรรทัดว่างหรือมีแต่ space: ข้ามไป

**Excel (.xlsx)**
- อ่าน sheet แรก
- อ่าน column แรก (A) ตั้งแต่ row 1 (ถ้า row 1 ดูเหมือน header ให้ user เลือกว่าจะ skip หรือไม่)
- cell ว่าง: ข้ามไป

**Merge behavior:**
- ชื่อที่ซ้ำกับที่มีอยู่แล้วในระบบ: skip (ไม่เพิ่มซ้ำ)
- แสดงสรุปหลัง import: "เพิ่ม X คน, ข้าม Y คน (ซ้ำ)"

---

### 3.3 Spin Wheel (หมุนวงล้อ)

**หน้าจอ:** ตรงกลาง (main area)

#### Flow

1. Admin เลือกรางวัลจาก **PrizeSelector** (dropdown — แสดงเฉพาะรางวัลที่ `remainingQty > 0`)
2. วงล้อแสดงชื่อผู้เข้าร่วมที่ `isEligible === true` (ทุกคนมีโอกาสเท่ากัน = segments เท่ากัน)
3. กดปุ่ม **"SPIN / หมุน"**
   - ปุ่ม disabled ระหว่างหมุน
   - เสียงหมุนเล่น
4. วงล้อหมุนและค่อยๆ ชะลอ (easing: ease-out cubic) → หยุด
5. ชื่อผู้ชนะถูก highlight บนวงล้อ + เสียงชนะเล่น
6. **Winner Modal** แสดงขึ้น:
   - ชื่อผู้ชนะ (ตัวใหญ่)
   - รางวัลที่ได้รับ (TH + EN)
   - ปุ่ม "ยืนยัน (Confirm)" และ "ยกเลิก (Cancel)"
7. เมื่อ Confirm:
   - participant → `isEligible = false`
   - prize → `remainingQty--`
   - บันทึก WinnerRecord ลง history
   - ถ้า `remainingQty === 0` → ซ่อนรางวัลนั้นจาก PrizeSelector
8. เมื่อ Cancel: ไม่มีผลกับ state (สามารถ re-spin ได้)

#### Edge Cases

| Situation | Behavior |
|---|---|
| ไม่มีผู้เข้าร่วมที่ eligible | ปุ่ม Spin disabled + แสดง message "ไม่มีผู้มีสิทธิ์เหลืออยู่" |
| ไม่ได้เลือกรางวัล | ปุ่ม Spin disabled + แสดง placeholder "กรุณาเลือกรางวัล" |
| eligible เหลือ 1 คน | หมุนได้ปกติ แต่ผลลัพธ์แน่นอน |

---

### 3.4 Winner History (ประวัติผู้ได้รับรางวัล)

**หน้าจอ:** Tab หรือ panel แยก

**ข้อมูลที่แสดง (ต่อ record):**
- ลำดับ (No.)
- ชื่อรางวัล (TH / EN ตามภาษาปัจจุบัน)
- ชื่อผู้ได้รับรางวัล
- วันที่-เวลา (format: `DD/MM/YYYY HH:mm:ss`)

**Actions:**
- Export Excel
- Export PDF
- ล้างประวัติ (confirm dialog)

---

### 3.5 Export

#### Excel (.xlsx)

- ชื่อไฟล์: `winner-report-YYYY-MM-DD.xlsx`
- Sheet: "รายชื่อผู้ได้รับรางวัล"
- Columns: No. | ชื่อรางวัล (TH) | Prize Name (EN) | ชื่อผู้ได้รับรางวัล | วันที่-เวลา
- Row 1: header (bold)
- Row 2+: ข้อมูล

#### PDF

- ชื่อไฟล์: `winner-report-YYYY-MM-DD.pdf`
- Layout: A4 portrait
- Header: Event Title (ผู้ใช้ตั้งได้ ดูข้อ 3.6) + วันที่ออกรายงาน
- Body: ตารางเดียวกับ Excel
- Font: ใช้ jspdf embedded font ที่รองรับ Unicode สำหรับภาษาไทย

**Edge case:** ถ้า history ว่างเปล่า → ไม่ดำเนินการ export + แสดง toast "ยังไม่มีข้อมูลผู้ได้รับรางวัล"

---

### 3.6 Event Settings (การตั้งค่างาน)

**Fields:**
- Event Title (TH) — ชื่องาน ใช้แสดงใน PDF header
- Event Title (EN)

เก็บใน localStorage key: `pw_eventTitle = { th, en }`

---

## 4. UI / UX

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Header: App name + Language Toggle (TH/EN) + Event     │
├───────────────┬─────────────────────────────────────────┤
│               │                                         │
│  Side Panel   │       Main: Spin Wheel Area             │
│  (tabs):      │  ┌──────────────────────────────────┐  │
│  - รางวัล     │  │   PrizeSelector (dropdown)        │  │
│  - ผู้เข้าร่วม│  │   Canvas Wheel                    │  │
│  - ประวัติ    │  │   SPIN Button                     │  │
│               │  └──────────────────────────────────┘  │
└───────────────┴─────────────────────────────────────────┘
```

### Theme

| Token | Value |
|---|---|
| bg-primary | `#F8FAFC` |
| accent | `#3B82F6` (blue-500) |
| border | `#E2E8F0` |
| text-primary | `#1E293B` |
| text-muted | `#64748B` |
| success | `#22C55E` |
| danger | `#EF4444` |

### Wheel Segment Colors (auto-assign palette)

```js
['#3B82F6','#EF4444','#22C55E','#F59E0B','#8B5CF6',
 '#EC4899','#14B8A6','#F97316','#6366F1','#84CC16']
```

### Responsive Breakpoints

- `< 768px (mobile)`: Side panel ย้ายไปด้านล่าง วงล้อเต็มหน้าจอ
- `≥ 768px (tablet+)`: Side panel ด้านซ้าย ความกว้าง 320px

---

## 5. Data Persistence (localStorage)

| Key | Type | Description |
|---|---|---|
| `pw_prizes` | `Prize[]` | รายการรางวัลทั้งหมด |
| `pw_participants` | `Participant[]` | รายชื่อผู้เข้าร่วมทั้งหมด |
| `pw_history` | `WinnerRecord[]` | ประวัติผู้ได้รับรางวัล |
| `pw_lang` | `'th' \| 'en'` | ภาษาปัจจุบัน (default: `'th'`) |
| `pw_eventTitle` | `{ th: string, en: string }` | ชื่องาน |

---

## 6. Sound Effects

ใช้ Web Audio API สร้างเสียงแบบ programmatic (ไม่ใช้ไฟล์เสียง) เพื่อลด asset size

| Event | Sound | Description |
|---|---|---|
| Spinning | Ticking noise | เสียง tick เร็วขึ้น/ช้าลงตาม wheel speed |
| Winner revealed | Fanfare chord | เสียงประกาศผู้ชนะ |

---

## 7. Acceptance Criteria

- [ ] สร้างรางวัล 3 รายการ + ผู้เข้าร่วม 10 คน → หมุนได้ไม่ error
- [ ] Import .txt 20 คน → รายชื่อปรากฏถูกต้อง ไม่ซ้ำ
- [ ] Import .xlsx → อ่าน column A ได้ถูกต้อง
- [ ] หมุนจนรางวัลหมด → รางวัลนั้นหายออกจาก selector
- [ ] ผู้ชนะรอบก่อนไม่ปรากฏบนวงล้อรอบถัดไป
- [ ] Refresh page → ข้อมูลทั้งหมดยังอยู่ครบ (localStorage)
- [ ] Export Excel → เปิดไฟล์ได้, columns ถูกต้อง
- [ ] Export PDF → เปิดไฟล์ได้, ภาษาไทยแสดงถูกต้อง
- [ ] สลับ TH/EN → ข้อความ UI เปลี่ยนทั้งหมด
- [ ] Mobile (375px) → ใช้งานได้ วงล้อไม่ถูก clip
