import { exportWinnersPDF } from '../../utils/exportPDF.js'

const HISTORY = [
  { id: '1', prizeName: 'Gold', participantName: 'Alice', timestamp: '2025-06-01T10:00:00.000Z' },
]

describe('exportWinnersPDF', () => {
  beforeEach(() => {
    window.open = vi.fn(() => ({
      document: { write: vi.fn(), close: vi.fn() },
    }))
  })

  test('returns false and does not open window for empty history', () => {
    const result = exportWinnersPDF([], 'Event', 'en')
    expect(result).toBe(false)
    expect(window.open).not.toHaveBeenCalled()
  })

  test('returns false when window.open is blocked (returns null)', () => {
    window.open = vi.fn(() => null)
    const result = exportWinnersPDF(HISTORY, 'Event', 'en')
    expect(result).toBe(false)
  })

  test('returns true when popup opens successfully', () => {
    const result = exportWinnersPDF(HISTORY, 'Event', 'en')
    expect(result).toBe(true)
  })

  test('calls window.open with blank target', () => {
    exportWinnersPDF(HISTORY, 'Event', 'en')
    expect(window.open).toHaveBeenCalledWith('', '_blank')
  })

  test('writes HTML containing the event title', () => {
    const mockDoc = { write: vi.fn(), close: vi.fn() }
    window.open = vi.fn(() => ({ document: mockDoc }))
    exportWinnersPDF(HISTORY, 'My Event', 'en')
    const html = mockDoc.write.mock.calls[0][0]
    expect(html).toContain('My Event')
  })

  test('writes HTML containing the participant name', () => {
    const mockDoc = { write: vi.fn(), close: vi.fn() }
    window.open = vi.fn(() => ({ document: mockDoc }))
    exportWinnersPDF(HISTORY, '', 'en')
    const html = mockDoc.write.mock.calls[0][0]
    expect(html).toContain('Alice')
  })

  test('writes HTML containing the prize name', () => {
    const mockDoc = { write: vi.fn(), close: vi.fn() }
    window.open = vi.fn(() => ({ document: mockDoc }))
    exportWinnersPDF(HISTORY, '', 'en')
    const html = mockDoc.write.mock.calls[0][0]
    expect(html).toContain('Gold')
  })

  test('uses default title when eventTitle is empty (EN)', () => {
    const mockDoc = { write: vi.fn(), close: vi.fn() }
    window.open = vi.fn(() => ({ document: mockDoc }))
    exportWinnersPDF(HISTORY, '', 'en')
    const html = mockDoc.write.mock.calls[0][0]
    expect(html).toContain('Winner Announcement')
  })

  test('uses default title when eventTitle is empty (TH)', () => {
    const mockDoc = { write: vi.fn(), close: vi.fn() }
    window.open = vi.fn(() => ({ document: mockDoc }))
    exportWinnersPDF(HISTORY, '', 'th')
    const html = mockDoc.write.mock.calls[0][0]
    expect(html).toContain('รายชื่อผู้ได้รับรางวัล')
  })

  test('includes Noto Sans Thai font link for Thai rendering', () => {
    const mockDoc = { write: vi.fn(), close: vi.fn() }
    window.open = vi.fn(() => ({ document: mockDoc }))
    exportWinnersPDF(HISTORY, '', 'th')
    const html = mockDoc.write.mock.calls[0][0]
    expect(html).toContain('Noto Sans Thai')
  })

  test('falls back to prizeNameTh when prizeName is absent', () => {
    const mockDoc = { write: vi.fn(), close: vi.fn() }
    window.open = vi.fn(() => ({ document: mockDoc }))
    const history = [{ id: '1', prizeNameTh: 'ทอง', participantName: 'Alice', timestamp: new Date().toISOString() }]
    exportWinnersPDF(history, '', 'th')
    const html = mockDoc.write.mock.calls[0][0]
    expect(html).toContain('ทอง')
  })
})
