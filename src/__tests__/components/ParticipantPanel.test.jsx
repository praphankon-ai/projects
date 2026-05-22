import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ParticipantPanel from '../../components/participant/ParticipantPanel.jsx'
import { renderWithProvider } from '../../test/helpers.jsx'

// TH placeholder: 'ชื่อ-นามสกุล', EN: 'Full Name'
const INPUT_PLACEHOLDER = /ชื่อ-นามสกุล|Full Name/i
// TH add button: 'เพิ่ม', EN: 'Add'
const ADD_BTN = /^เพิ่ม$|^Add$/i
// TH reset: 'รีเซ็ตทั้งหมด', EN: 'Reset All'
const RESET_BTN = /รีเซ็ตทั้งหมด|Reset All/i

describe('ParticipantPanel', () => {
  test('shows empty state message when no participants', () => {
    renderWithProvider(<ParticipantPanel />)
    // TH: 'ยังไม่มีรายชื่อ', EN: 'No participants yet'
    expect(screen.getByText(/ยังไม่มีรายชื่อ|No participants yet/i)).toBeInTheDocument()
  })

  test('adds a participant by typing name and submitting', async () => {
    const user = userEvent.setup()
    renderWithProvider(<ParticipantPanel />)
    await user.type(screen.getByPlaceholderText(INPUT_PLACEHOLDER), 'Alice')
    await user.click(screen.getByRole('button', { name: ADD_BTN }))
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  test('add button is disabled when input is empty', () => {
    renderWithProvider(<ParticipantPanel />)
    expect(screen.getByRole('button', { name: ADD_BTN })).toBeDisabled()
  })

  test('does not add duplicate participant', async () => {
    const user = userEvent.setup()
    renderWithProvider(<ParticipantPanel />)
    const input = screen.getByPlaceholderText(INPUT_PLACEHOLDER)
    await user.type(input, 'Alice')
    await user.click(screen.getByRole('button', { name: ADD_BTN }))
    await user.type(input, 'Alice')
    await user.click(screen.getByRole('button', { name: ADD_BTN }))
    // Only one "Alice" entry in the list
    expect(screen.getAllByText('Alice')).toHaveLength(1)
  })

  test('clears input after successful add', async () => {
    const user = userEvent.setup()
    renderWithProvider(<ParticipantPanel />)
    const input = screen.getByPlaceholderText(INPUT_PLACEHOLDER)
    await user.type(input, 'Bob')
    await user.click(screen.getByRole('button', { name: ADD_BTN }))
    expect(input).toHaveValue('')
  })

  test('shows eligible count in stats', async () => {
    const user = userEvent.setup()
    renderWithProvider(<ParticipantPanel />)
    for (const name of ['Alice', 'Bob']) {
      await user.type(screen.getByPlaceholderText(INPUT_PLACEHOLDER), name)
      await user.click(screen.getByRole('button', { name: ADD_BTN }))
    }
    // TH: '2 มีสิทธิ์', EN: '2 eligible'
    expect(screen.getByText(/2 มีสิทธิ์|2 eligible/i)).toBeInTheDocument()
  })

  test('shows won badge for ineligible participants', () => {
    const participants = [
      { id: 'p1', name: 'Alice', isEligible: false },
      { id: 'p2', name: 'Bob', isEligible: true },
    ]
    localStorage.setItem('pw_participants', JSON.stringify(participants))
    renderWithProvider(<ParticipantPanel />)
    // wonBadge text: TH 'ได้รับรางวัล', EN 'Won'
    // getAllByText because stats area also has related text; check at least one exists
    const badges = screen.getAllByText(/^ได้รับรางวัล$|^Won$/i)
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  test('resets all participants after confirmation', async () => {
    window.confirm = vi.fn(() => true)
    const user = userEvent.setup()
    localStorage.setItem('pw_participants', JSON.stringify([
      { id: 'p1', name: 'Alice', isEligible: true },
    ]))
    renderWithProvider(<ParticipantPanel />)
    await user.click(screen.getByRole('button', { name: RESET_BTN }))
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByText(/ยังไม่มีรายชื่อ|No participants yet/i)).toBeInTheDocument()
  })

  test('does NOT reset when user cancels the confirmation', async () => {
    window.confirm = vi.fn(() => false)
    const user = userEvent.setup()
    localStorage.setItem('pw_participants', JSON.stringify([
      { id: 'p1', name: 'Alice', isEligible: true },
    ]))
    renderWithProvider(<ParticipantPanel />)
    await user.click(screen.getByRole('button', { name: RESET_BTN }))
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })
})
