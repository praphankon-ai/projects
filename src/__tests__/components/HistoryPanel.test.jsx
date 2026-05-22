import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HistoryPanel from '../../components/history/HistoryPanel.jsx'
import { renderWithProvider } from '../../test/helpers.jsx'
import * as exportExcel from '../../utils/exportExcel.js'
import * as exportPDF from '../../utils/exportPDF.js'

vi.mock('../../utils/exportExcel.js', () => ({ exportWinnersExcel: vi.fn(() => true) }))
vi.mock('../../utils/exportPDF.js', () => ({ exportWinnersPDF: vi.fn(() => true) }))

const HISTORY = [
  { id: '1', prizeName: 'Gold', participantName: 'Alice', timestamp: '2025-06-01T10:00:00.000Z' },
  { id: '2', prizeName: 'Silver', participantName: 'Bob', timestamp: '2025-06-01T11:00:00.000Z' },
]

describe('HistoryPanel', () => {
  test('shows empty state when history is empty', () => {
    renderWithProvider(<HistoryPanel />)
    // TH default: 'ยังไม่มีข้อมูล', EN: 'No records yet'
    expect(screen.getByText(/ยังไม่มีข้อมูล|No records yet/i)).toBeInTheDocument()
  })

  test('renders history records in the table', () => {
    localStorage.setItem('pw_history', JSON.stringify(HISTORY))
    renderWithProvider(<HistoryPanel />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Gold')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Silver')).toBeInTheDocument()
  })

  test('calls exportWinnersExcel when Excel button clicked', async () => {
    const user = userEvent.setup()
    localStorage.setItem('pw_history', JSON.stringify(HISTORY))
    renderWithProvider(<HistoryPanel />)
    await user.click(screen.getByRole('button', { name: /Excel/i }))
    expect(exportExcel.exportWinnersExcel).toHaveBeenCalled()
  })

  test('calls exportWinnersPDF when PDF button clicked', async () => {
    const user = userEvent.setup()
    localStorage.setItem('pw_history', JSON.stringify(HISTORY))
    renderWithProvider(<HistoryPanel />)
    await user.click(screen.getByRole('button', { name: /PDF/i }))
    expect(exportPDF.exportWinnersPDF).toHaveBeenCalled()
  })

  test('alerts when exporting Excel with empty history', async () => {
    const user = userEvent.setup()
    window.alert = vi.fn()
    renderWithProvider(<HistoryPanel />)
    await user.click(screen.getByRole('button', { name: /Excel/i }))
    expect(window.alert).toHaveBeenCalled()
  })

  test('alerts when exporting PDF with empty history', async () => {
    const user = userEvent.setup()
    window.alert = vi.fn()
    renderWithProvider(<HistoryPanel />)
    await user.click(screen.getByRole('button', { name: /PDF/i }))
    expect(window.alert).toHaveBeenCalled()
  })

  test('clear button hidden when history is empty', () => {
    renderWithProvider(<HistoryPanel />)
    // TH: 'ล้างประวัติ', EN: 'Clear History'
    expect(screen.queryByRole('button', { name: /ล้างประวัติ|Clear History/i })).not.toBeInTheDocument()
  })

  test('clear button visible when history has records', () => {
    localStorage.setItem('pw_history', JSON.stringify(HISTORY))
    renderWithProvider(<HistoryPanel />)
    expect(screen.getByRole('button', { name: /ล้างประวัติ|Clear History/i })).toBeInTheDocument()
  })

  test('clears history after confirmation', async () => {
    window.confirm = vi.fn(() => true)
    const user = userEvent.setup()
    localStorage.setItem('pw_history', JSON.stringify(HISTORY))
    renderWithProvider(<HistoryPanel />)
    await user.click(screen.getByRole('button', { name: /ล้างประวัติ|Clear History/i }))
    expect(screen.getByText(/ยังไม่มีข้อมูล|No records yet/i)).toBeInTheDocument()
  })

  test('does not clear history when user cancels', async () => {
    window.confirm = vi.fn(() => false)
    const user = userEvent.setup()
    localStorage.setItem('pw_history', JSON.stringify(HISTORY))
    renderWithProvider(<HistoryPanel />)
    await user.click(screen.getByRole('button', { name: /ล้างประวัติ|Clear History/i }))
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  test('falls back to prizeNameTh when prizeName is absent', () => {
    const history = [{ id: '1', prizeNameTh: 'ทอง', participantName: 'Alice', timestamp: new Date().toISOString() }]
    localStorage.setItem('pw_history', JSON.stringify(history))
    renderWithProvider(<HistoryPanel />)
    expect(screen.getByText('ทอง')).toBeInTheDocument()
  })
})
