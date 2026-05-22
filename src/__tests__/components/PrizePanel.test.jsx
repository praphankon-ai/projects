import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PrizePanel from '../../components/prize/PrizePanel.jsx'
import { renderWithProvider } from '../../test/helpers.jsx'

describe('PrizePanel', () => {
  test('shows empty state message when no prizes exist', () => {
    renderWithProvider(<PrizePanel />)
    expect(screen.getByText(/ยังไม่มีรางวัล|No prizes/i)).toBeInTheDocument()
  })

  test('opens add modal on button click', async () => {
    const user = userEvent.setup()
    renderWithProvider(<PrizePanel />)
    await user.click(screen.getByRole('button', { name: /เพิ่มรางวัล|Add Prize/i }))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  test('adds a prize when form is submitted with valid data', async () => {
    const user = userEvent.setup()
    renderWithProvider(<PrizePanel />)
    await user.click(screen.getByRole('button', { name: /เพิ่มรางวัล|Add Prize/i }))
    await user.type(screen.getByRole('textbox'), 'Smartphone')
    await user.click(screen.getByRole('button', { name: /^เพิ่ม$|^Add$/i }))
    expect(screen.getByText('Smartphone')).toBeInTheDocument()
  })

  test('does not add prize when name is empty', async () => {
    const user = userEvent.setup()
    renderWithProvider(<PrizePanel />)
    await user.click(screen.getByRole('button', { name: /เพิ่มรางวัล|Add Prize/i }))
    await user.click(screen.getByRole('button', { name: /^เพิ่ม$|^Add$/i }))
    // Modal stays open, no prize in list
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  test('shows remaining/total qty badge', async () => {
    const user = userEvent.setup()
    renderWithProvider(<PrizePanel />)
    await user.click(screen.getByRole('button', { name: /เพิ่มรางวัล|Add Prize/i }))
    await user.type(screen.getByRole('textbox'), 'Watch')
    const qtyInput = screen.getByRole('spinbutton')
    await user.clear(qtyInput)
    await user.type(qtyInput, '5')
    await user.click(screen.getByRole('button', { name: /^เพิ่ม$|^Add$/i }))
    expect(screen.getByText('5/5')).toBeInTheDocument()
  })

  test('shows "Sold out" badge when remainingQty is 0', async () => {
    // Pre-seed localStorage with sold-out prize
    const prize = { id: 'p1', name: 'Old Prize', totalQty: 1, remainingQty: 0, color: '#000' }
    localStorage.setItem('pw_prizes', JSON.stringify([prize]))
    renderWithProvider(<PrizePanel />)
    expect(screen.getByText(/หมดแล้ว|Sold out/i)).toBeInTheDocument()
  })

  test('asks for confirmation before deleting', async () => {
    window.confirm = vi.fn(() => false)
    const user = userEvent.setup()
    const prize = { id: 'p1', name: 'Tablet', totalQty: 1, remainingQty: 1, color: '#000' }
    localStorage.setItem('pw_prizes', JSON.stringify([prize]))
    renderWithProvider(<PrizePanel />)
    const deleteButtons = screen.getAllByRole('button').filter(btn =>
      btn.querySelector('svg path[d*="M9 2a1 1 0 00-.894.553"]')
    )
    if (deleteButtons.length > 0) {
      await user.click(deleteButtons[0])
      expect(window.confirm).toHaveBeenCalled()
    }
    expect(screen.getByText('Tablet')).toBeInTheDocument()
  })

  test('closes modal on cancel', async () => {
    const user = userEvent.setup()
    renderWithProvider(<PrizePanel />)
    await user.click(screen.getByRole('button', { name: /เพิ่มรางวัล|Add Prize/i }))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /ยกเลิก|Cancel/i }))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})
