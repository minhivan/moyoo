import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from './App'
import * as photo from './lib/photo'

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('moyoo studio', () => {
  it('renders welcome screen and transitions into studio', () => {
    render(<App />)
    expect(screen.getByText(/Một chút bạn/i)).toBeTruthy()

    // Enter studio
    const enterBtn = screen.getByRole('button', { name: /Vào Studio/i })
    fireEvent.click(enterBtn)

    // Now in studio
    expect(screen.getByText('Khung ảnh')).toBeTruthy()
    expect(screen.getByText('Bắt đầu chụp')).toBeTruthy()
  })

  it('lets a visitor select a frame in studio before entering camera step', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Vào Studio/i }))

    const blushBtn = screen.getByRole('button', { name: 'Blush Note', pressed: false })
    fireEvent.click(blushBtn)
    expect(screen.getByRole('button', { name: /Blush Note/i, pressed: true })).toBeTruthy()
  })

  it('shows a useful error when camera access is unavailable', async () => {
    vi.stubGlobal('navigator', { mediaDevices: undefined })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Vào Studio/i }))
    fireEvent.click(screen.getByRole('button', { name: /Bắt đầu chụp/i }))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/HTTPS\/localhost/))
  })

  it('switches languages smoothly on welcome screen and studio', () => {
    render(<App />)
    expect(screen.getByText(/Một chút bạn/i)).toBeTruthy()

    // Switch to English
    fireEvent.click(screen.getByRole('button', { name: 'EN' }))
    expect(screen.getByText(/A little you/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Enter Studio' })).toBeTruthy()

    // Enter Studio in English
    fireEvent.click(screen.getByRole('button', { name: 'Enter Studio' }))
    expect(screen.getByText('Frame')).toBeTruthy()
    expect(screen.getByText('Start Shooting')).toBeTruthy()

    // Switch back to Vietnamese
    fireEvent.click(screen.getByRole('button', { name: 'VI' }))
    expect(screen.getByText('Bắt đầu chụp')).toBeTruthy()
  })

  it('toggles audio sound effect preference', () => {
    render(<App />)
    const audioBtn = screen.getByTitle(/Âm thanh/i)
    expect(audioBtn).toBeTruthy()
    fireEvent.click(audioBtn)
    expect(screen.getByTitle(/Âm thanh: Tắt/i)).toBeTruthy()
  })

  it('toggles template layout between 1x4 strip and 2x2 grid', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Vào Studio/i }))

    // Switch to template tab
    fireEvent.click(screen.getByRole('tab', { name: /Bố cục/i }))
    const gridBtn = screen.getByRole('button', { name: /Lưới vuông/i })
    fireEvent.click(gridBtn)
    expect(gridBtn.getAttribute('aria-pressed')).toBe('true')
  })

  it('customizes stamp and letterpress signature', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Vào Studio/i }))

    // Switch to Stamp tab
    fireEvent.click(screen.getByRole('tab', { name: /Dấu ấn/i }))
    const letterpressBtn = screen.getByRole('button', { name: /Dập chìm Studio/i })
    fireEvent.click(letterpressBtn)
    expect(letterpressBtn.getAttribute('aria-pressed')).toBe('true')

    const input = screen.getByPlaceholderText(/Ghi dấu kỷ niệm/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Saigon Memories' } })
    expect(input.value).toBe('Saigon Memories')
  })

  it('selects paper finishes', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Vào Studio/i }))

    // Switch to Paper finish tab
    fireEvent.click(screen.getByRole('tab', { name: /Chất giấy/i }))
    const glossyBtn = screen.getByRole('button', { name: /Tráng bóng/i })
    fireEvent.click(glossyBtn)
    expect(glossyBtn.getAttribute('aria-pressed')).toBe('true')
  })
  it('accepts four files directly from the welcome screen and opens the result', async () => {
    vi.spyOn(photo, 'readImageFile').mockResolvedValue('data:image/jpeg;base64,dGVzdA==')
    render(<App />)
    const files = Array.from({ length: 4 }, (_, i) => new File(['photo'], `shot-${i}.jpg`, { type: 'image/jpeg' }))
    fireEvent.change(screen.getByLabelText('Tải 4 ảnh từ thiết bị'), { target: { files } })
    await waitFor(() => expect(screen.getByRole('button', { name: /Lưu dải ảnh/ })).toBeTruthy())
    expect(photo.readImageFile).toHaveBeenCalledTimes(4)
  })

  it('supports keyboard activation of individual photo slots', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Vào Studio/i }))
    fireEvent.keyDown(screen.getByRole('button', { name: 'Photo slot 2' }), { key: 'Enter' })
    expect(screen.getByText('Ô ảnh số 2')).toBeTruthy()
  })

  it('captures four distinct frames in auto mode and stops the stream', async () => {
    vi.useFakeTimers()
    const stop = vi.fn()
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] }) } })
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    let shot = 0
    vi.spyOn(photo, 'captureFrame').mockImplementation(() => `data:image/jpeg;base64,shot${++shot}`)
    render(<App />)
    fireEvent.click(screen.getByTitle('Âm thanh: Bật'))
    fireEvent.click(screen.getByRole('button', { name: /Vào Studio/i }))
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu chụp' })) })
    fireEvent.click(screen.getByRole('button', { name: 'Chụp ảnh 1 / 4' }))
    for (let index = 0; index < 4; index++) {
      await act(async () => { await vi.advanceTimersByTimeAsync(3000) })
      if (index < 3) await act(async () => { await vi.advanceTimersByTimeAsync(1600) })
    }
    expect(photo.captureFrame).toHaveBeenCalledTimes(4)
    expect(photo.captureFrame).toHaveBeenLastCalledWith(expect.any(HTMLVideoElement), 'none', true)
    expect(screen.getByRole('button', { name: /Lưu dải ảnh/ })).toBeTruthy()
    expect(stop).toHaveBeenCalledOnce()
    const pictures = screen.getByTestId('photostrip').querySelectorAll('img')
    expect(Array.from(pictures).map((image) => image.getAttribute('src'))).toEqual([1, 2, 3, 4].map((index) => `data:image/jpeg;base64,shot${index}`))
  })

  it('cancels a scheduled auto shot when leaving the camera', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop: vi.fn() }] }) } })
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(photo, 'captureFrame').mockReturnValue('data:image/jpeg;base64,shot')
    render(<App />)
    fireEvent.click(screen.getByTitle('Âm thanh: Bật'))
    fireEvent.click(screen.getByRole('button', { name: /Vào Studio/i }))
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu chụp' })) })
    fireEvent.click(screen.getByRole('button', { name: 'Chụp ảnh 1 / 4' }))
    await act(async () => { await vi.advanceTimersByTimeAsync(3000) })
    fireEvent.click(screen.getByRole('button', { name: 'Quay lại' }))
    await act(async () => { await vi.advanceTimersByTimeAsync(10000) })
    expect(photo.captureFrame).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Bắt đầu chụp' })).toBeTruthy()
  })

})
