const i18n = {
  th: {
    appTitle: 'Lucky Draw — สุ่มรางวัล',
    prizes: 'รางวัล',
    participants: 'ผู้เข้าร่วม',
    history: 'ประวัติ',
    settings: 'ตั้งค่า',

    // Prize
    addPrize: 'เพิ่มรางวัล',
    prizeName: 'ชื่อรางวัล',
    totalQty: 'จำนวน',
    remaining: 'คงเหลือ',
    soldOut: 'หมดแล้ว',
    noPrizes: 'ยังไม่มีรางวัล',

    // Participant
    addParticipant: 'เพิ่มผู้เข้าร่วม',
    participantName: 'ชื่อ-นามสกุล',
    importFile: 'นำเข้าจากไฟล์',
    importTitle: 'นำเข้ารายชื่อ',
    dropOrClick: 'วางไฟล์หรือคลิกเพื่อเลือก (.txt หรือ .xlsx)',
    skipHeader: 'ข้าม Row แรก (Header)',
    resetParticipants: 'รีเซ็ตทั้งหมด',
    resetConfirm: 'รีเซ็ตรายชื่อผู้เข้าร่วมทั้งหมดหรือไม่?',
    wonBadge: 'ได้รับรางวัล',
    noParticipants: 'ยังไม่มีรายชื่อ',
    eligible: 'มีสิทธิ์',
    won: 'ได้รับรางวัลแล้ว',

    // Spin
    selectPrizePlaceholder: '— เลือกรางวัลที่จะสุ่ม —',
    spin: 'หมุน!',
    spinning: 'กำลังหมุน...',
    eligibleCount: (n) => `${n} คนมีสิทธิ์`,
    noEligible: 'ไม่มีผู้มีสิทธิ์เหลืออยู่',
    noPrizesLeft: 'รางวัลหมดทุกรายการแล้ว',

    // Winner Modal
    winnerTitle: 'ผู้ได้รับรางวัล',
    gets: 'ได้รับ',
    confirmWinner: 'ยืนยัน',
    cancelSpin: 'หมุนใหม่',

    // History
    historyTitle: 'ประวัติผู้ได้รับรางวัล',
    exportExcel: 'Export Excel',
    exportPDF: 'Export PDF',
    clearHistory: 'ล้างประวัติ',
    clearHistoryConfirm: 'ล้างประวัติผู้ได้รับรางวัลทั้งหมดหรือไม่?',
    noHistory: 'ยังไม่มีข้อมูล',
    col_no: '#',
    col_prize: 'รางวัล',
    col_winner: 'ผู้ได้รับรางวัล',
    col_datetime: 'วันที่-เวลา',
    emptyHistoryExport: 'ยังไม่มีข้อมูลผู้ได้รับรางวัล',

    // Settings
    eventTitle: 'ชื่องาน / Event Title',
    eventTitlePlaceholder: 'เช่น งานเลี้ยงประจำปี 2026',

    // Mobile tab
    spinTab: 'วงล้อ',

    // Common
    edit: 'แก้ไข',
    delete: 'ลบ',
    cancel: 'ยกเลิก',
    confirm: 'ยืนยัน',
    save: 'บันทึก',
    add: 'เพิ่ม',
    deleteConfirm: 'ยืนยันการลบ?',
    importResult: (added, skipped) => `เพิ่ม ${added} คน, ข้าม ${skipped} คน (ซ้ำ)`,
    foundNames: (n) => `พบ ${n} รายชื่อ:`,
  },

  en: {
    appTitle: 'Lucky Draw — Prize Wheel',
    prizes: 'Prizes',
    participants: 'Participants',
    history: 'History',
    settings: 'Settings',

    // Prize
    addPrize: 'Add Prize',
    prizeName: 'Prize Name',
    totalQty: 'Quantity',
    remaining: 'Remaining',
    soldOut: 'Sold Out',
    noPrizes: 'No prizes yet',

    // Participant
    addParticipant: 'Add Participant',
    participantName: 'Full Name',
    importFile: 'Import from File',
    importTitle: 'Import Participants',
    dropOrClick: 'Drop file or click to select (.txt or .xlsx)',
    skipHeader: 'Skip first row (Header)',
    resetParticipants: 'Reset All',
    resetConfirm: 'Reset all participants?',
    wonBadge: 'Won',
    noParticipants: 'No participants yet',
    eligible: 'eligible',
    won: 'won',

    // Spin
    selectPrizePlaceholder: '— Select prize to draw —',
    spin: 'SPIN!',
    spinning: 'Spinning...',
    eligibleCount: (n) => `${n} eligible`,
    noEligible: 'No eligible participants',
    noPrizesLeft: 'All prizes distributed',

    // Winner Modal
    winnerTitle: 'Prize Winner!',
    gets: 'wins',
    confirmWinner: 'Confirm',
    cancelSpin: 'Re-spin',

    // History
    historyTitle: 'Winner History',
    exportExcel: 'Export Excel',
    exportPDF: 'Export PDF',
    clearHistory: 'Clear History',
    clearHistoryConfirm: 'Clear all winner history?',
    noHistory: 'No records yet',
    col_no: '#',
    col_prize: 'Prize',
    col_winner: 'Winner',
    col_datetime: 'Date/Time',
    emptyHistoryExport: 'No winner records to export',

    // Settings
    eventTitle: 'Event Title / ชื่องาน',
    eventTitlePlaceholder: 'e.g. Annual Party 2026',

    // Mobile tab
    spinTab: 'Wheel',

    // Common
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    add: 'Add',
    deleteConfirm: 'Confirm delete?',
    importResult: (added, skipped) => `Added ${added}, skipped ${skipped} (duplicates)`,
    foundNames: (n) => `Found ${n} names:`,
  },
}

export default i18n
