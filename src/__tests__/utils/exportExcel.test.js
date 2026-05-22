import { exportWinnersExcel } from '../../utils/exportExcel.js'
import * as XLSX from 'xlsx'

vi.mock('xlsx', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    writeFile: vi.fn(),
  }
})

const TODAY = new Date().toISOString().slice(0, 10)

const HISTORY = [
  { id: '1', prizeId: 'p1', prizeName: 'Gold', participantName: 'Alice', timestamp: '2025-06-01T10:00:00.000Z' },
  { id: '2', prizeId: 'p2', prizeName: 'Silver', participantName: 'Bob', timestamp: '2025-06-01T11:00:00.000Z' },
]

describe('exportWinnersExcel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns false and does not write file for empty history', () => {
    const result = exportWinnersExcel([], 'en')
    expect(result).toBe(false)
    expect(XLSX.writeFile).not.toHaveBeenCalled()
  })

  test('returns true when history has records', () => {
    const result = exportWinnersExcel(HISTORY, 'en')
    expect(result).toBe(true)
  })

  test('calls XLSX.writeFile with date-stamped filename', () => {
    exportWinnersExcel(HISTORY, 'en')
    expect(XLSX.writeFile).toHaveBeenCalledWith(
      expect.anything(),
      `winner-report-${TODAY}.xlsx`,
    )
  })

  test('EN headers: #, Prize Name, Winner, Date/Time', () => {
    exportWinnersExcel(HISTORY, 'en')
    const wb = XLSX.writeFile.mock.calls[0][0]
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })
    expect(rows[0]).toEqual(['#', 'Prize Name', 'Winner', 'Date/Time'])
  })

  test('TH headers: #, ชื่อรางวัล, ผู้ได้รับรางวัล, วันที่-เวลา', () => {
    exportWinnersExcel(HISTORY, 'th')
    const wb = XLSX.writeFile.mock.calls[0][0]
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })
    expect(rows[0]).toEqual(['#', 'ชื่อรางวัล', 'ผู้ได้รับรางวัล', 'วันที่-เวลา'])
  })

  test('data rows contain sequential index, prize name, winner name', () => {
    exportWinnersExcel(HISTORY, 'en')
    const wb = XLSX.writeFile.mock.calls[0][0]
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })
    expect(rows[1][0]).toBe(1)
    expect(rows[1][1]).toBe('Gold')
    expect(rows[1][2]).toBe('Alice')
    expect(rows[2][0]).toBe(2)
    expect(rows[2][1]).toBe('Silver')
    expect(rows[2][2]).toBe('Bob')
  })

  test('falls back to prizeNameTh when prizeName is absent', () => {
    const history = [{ id: '1', prizeNameTh: 'ทอง', participantName: 'Alice', timestamp: new Date().toISOString() }]
    exportWinnersExcel(history, 'en')
    const wb = XLSX.writeFile.mock.calls[0][0]
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })
    expect(rows[1][1]).toBe('ทอง')
  })
})
