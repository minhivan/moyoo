import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import App from './App'
import * as photo from './lib/photo'
import { templateOptions } from './data/frames'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

function stubCamera() {
  const stop = vi.fn()
  const getUserMedia = vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] })
  vi.stubGlobal('navigator', { ...navigator, mediaDevices: { getUserMedia } })
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
  return { stop, getUserMedia }
}

async function openLiveCamera() {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Tắt âm thanh' }))
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Mở camera' }))
  })
}

async function shoot(times: number, autoGapAfterEach = false) {
  for (let index = 0; index < times; index++) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000)
    })
    if (autoGapAfterEach && index < times - 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1400)
      })
    }
  }
}

describe('moyoo app', () => {
  it('opens on the camera with no landing page', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Mở camera' })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Dải 4/, pressed: true })).toBeTruthy()
    expect(screen.queryByText(/Vào Studio/)).toBeNull()
  })

  it('switches shooting mode before a session starts', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /1 tấm/ }))
    expect(screen.getByRole('button', { name: /1 tấm/, pressed: true })).toBeTruthy()
  })

  it('explains when the browser has no camera API', async () => {
    vi.stubGlobal('navigator', { ...navigator, mediaDevices: undefined })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Mở camera' }))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/không hỗ trợ camera/))
    expect(screen.getAllByRole('button', { name: /Chọn ảnh từ máy/ }).length).toBeGreaterThan(0)
  })

  it('tells people opening an http address to use HTTPS', async () => {
    vi.stubGlobal('isSecureContext', false)
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Mở camera' }))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/HTTPS hoặc localhost/))
    expect(screen.getByText('Mã lỗi: InsecureContext')).toBeTruthy()
  })

  it('names a busy camera and shows the error code', async () => {
    const getUserMedia = vi.fn().mockRejectedValue(new DOMException('busy', 'NotReadableError'))
    vi.stubGlobal('navigator', { ...navigator, mediaDevices: { getUserMedia } })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Mở camera' }))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/ứng dụng khác/))
    expect(getUserMedia).toHaveBeenCalledTimes(3)
    expect(screen.getByText(/Mã lỗi: NotReadableError/)).toBeTruthy()
  })

  it('retries with looser constraints when the camera rejects the preferred size', async () => {
    const getUserMedia = vi
      .fn()
      .mockRejectedValueOnce(new DOMException('size', 'OverconstrainedError'))
      .mockResolvedValue({ getTracks: () => [{ stop: vi.fn() }] })
    vi.stubGlobal('navigator', { ...navigator, mediaDevices: { getUserMedia } })
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    render(<App />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Mở camera' }))
    })
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Mở camera' })).toBeNull())
    expect(getUserMedia).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('button', { name: 'Chụp ảnh 1 trên 4' })).toBeTruthy()
  })

  it('switches language from settings and keeps the choice', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Cài đặt' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'English' }))
    expect(screen.getByRole('button', { name: 'Open camera', hidden: true })).toBeTruthy()
    expect(localStorage.getItem('moyoo_lang')).toBe('en')
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Tiếng Việt' }))
    expect(screen.getByRole('button', { name: 'Mở camera', hidden: true })).toBeTruthy()
  })

  it('still renders when storage access throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    render(<App />)
    expect(screen.getByRole('button', { name: 'Mở camera' })).toBeTruthy()
  })

  it('toggles sound', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Tắt âm thanh' }))
    expect(screen.getByRole('button', { name: 'Bật âm thanh' })).toBeTruthy()
  })

  it('picks a frame colour from the tray', async () => {
    stubCamera()
    await openLiveCamera()
    fireEvent.click(screen.getByRole('button', { name: 'Khung' }))
    fireEvent.click(screen.getByRole('button', { name: /Hồng phấn/ }))
    expect(screen.getByRole('button', { name: /Hồng phấn/, pressed: true })).toBeTruthy()
  })

  it('fills four slots from device photos and opens the review', async () => {
    vi.spyOn(photo, 'readImageFile').mockImplementation(async (file) => `data:image/jpeg;base64,${file.name}`)
    render(<App />)
    const files = Array.from({ length: 4 }, (_, index) => new File(['x'], `f${index}`, { type: 'image/jpeg' }))
    fireEvent.change(screen.getByLabelText('Chọn ảnh từ máy', { selector: 'input' }), { target: { files } })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Lưu ảnh' })).toBeTruthy())
    const sources = Array.from(screen.getByTestId('print').querySelectorAll('img')).map((image) => image.getAttribute('src'))
    expect(sources).toEqual(['f0', 'f1', 'f2', 'f3'].map((name) => `data:image/jpeg;base64,${name}`))
  })

  it('single mode needs one photo and hides per-shot saving', async () => {
    vi.spyOn(photo, 'readImageFile').mockResolvedValue('data:image/jpeg;base64,one')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /1 tấm/ }))
    fireEvent.change(screen.getByLabelText('Chọn ảnh từ máy', { selector: 'input' }), {
      target: { files: [new File(['x'], 'a.jpg', { type: 'image/jpeg' })] },
    })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Lưu ảnh' })).toBeTruthy())
    expect(screen.queryByRole('button', { name: 'Lưu từng tấm' })).toBeNull()
    expect(screen.queryByRole('tab', { name: 'Bố cục' })).toBeNull()
  })

  it('shows a readable error when a file cannot be read', async () => {
    vi.spyOn(photo, 'readImageFile').mockRejectedValue(new Error('bad'))
    render(<App />)
    fireEvent.change(screen.getByLabelText('Chọn ảnh từ máy', { selector: 'input' }), {
      target: { files: [new File(['x'], 'a.heic')] },
    })
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/Không đọc được ảnh/))
  })

  it('auto mode captures four distinct shots, then stops the stream', async () => {
    vi.useFakeTimers()
    const { stop } = stubCamera()
    let shot = 0
    vi.spyOn(photo, 'captureFrame').mockImplementation(() => `data:image/jpeg;base64,shot${++shot}`)
    await openLiveCamera()
    fireEvent.click(screen.getByRole('button', { name: 'Chụp ảnh 1 trên 4' }))
    await shoot(4, true)
    expect(photo.captureFrame).toHaveBeenCalledTimes(4)
    expect(photo.captureFrame).toHaveBeenLastCalledWith(expect.any(HTMLVideoElement), expect.objectContaining({ mirror: true }))
    expect(stop).toHaveBeenCalled()
    const sources = Array.from(screen.getByTestId('print').querySelectorAll('img')).map((image) => image.getAttribute('src'))
    expect(sources).toEqual([1, 2, 3, 4].map((index) => `data:image/jpeg;base64,shot${index}`))
  })

  it('pressing the shutter again cancels the countdown and the next auto shot', async () => {
    vi.useFakeTimers()
    stubCamera()
    vi.spyOn(photo, 'captureFrame').mockReturnValue('data:image/jpeg;base64,shot')
    await openLiveCamera()
    fireEvent.click(screen.getByRole('button', { name: 'Chụp ảnh 1 trên 4' }))
    await shoot(1)
    fireEvent.click(screen.getByRole('button', { name: /Chụp ảnh 2 trên 4/ }))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000)
    })
    expect(photo.captureFrame).toHaveBeenCalledOnce()
  })

  it('discarding a set asks first and keeps photos on cancel', async () => {
    vi.useFakeTimers()
    stubCamera()
    vi.spyOn(photo, 'captureFrame').mockReturnValue('data:image/jpeg;base64,shot')
    await openLiveCamera()
    fireEvent.click(screen.getByRole('button', { name: 'Tự chụp' }))
    fireEvent.click(screen.getByRole('button', { name: 'Chụp ảnh 1 trên 4' }))
    await shoot(1)
    fireEvent.click(screen.getByRole('button', { name: 'Bỏ bộ ảnh' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Giữ lại' }))
    expect(screen.getByRole('button', { name: 'Chụp ảnh 2 trên 4' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Bỏ bộ ảnh' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Bỏ ảnh' }))
    expect(screen.getByRole('button', { name: 'Chụp ảnh 1 trên 4' })).toBeTruthy()
  })

  it('retakes one slot from the review and keeps the others', async () => {
    vi.useFakeTimers()
    stubCamera()
    let shot = 0
    vi.spyOn(photo, 'captureFrame').mockImplementation(() => `data:image/jpeg;base64,shot${++shot}`)
    await openLiveCamera()
    fireEvent.click(screen.getByRole('button', { name: 'Chụp ảnh 1 trên 4' }))
    await shoot(4, true)

    fireEvent.click(screen.getByRole('button', { name: 'Ô ảnh 2' }))
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Chụp lại tấm này' }))
    })
    expect(screen.getByText('Chụp lại ô 2')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Chụp ảnh 2 trên 4' }))
    await shoot(1)

    const sources = Array.from(screen.getByTestId('print').querySelectorAll('img')).map((image) => image.getAttribute('src'))
    expect(sources).toEqual(['shot1', 'shot5', 'shot3', 'shot4'].map((name) => `data:image/jpeg;base64,${name}`))
  })
})

describe('camera permission', () => {
  it('explains a blocked camera before anyone taps, with steps for the browser', async () => {
    const status = Object.assign(new EventTarget(), { state: 'denied' as PermissionState })
    vi.stubGlobal('navigator', { ...navigator, permissions: { query: vi.fn().mockResolvedValue(status) } })
    render(<App />)
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/Camera đang bị chặn/))
    expect(screen.getByText(/Mã lỗi: PermissionState/)).toBeTruthy()
  })

  it('opens the camera by itself when access is switched back on', async () => {
    const status = Object.assign(new EventTarget(), { state: 'denied' as PermissionState })
    const getUserMedia = vi.fn().mockResolvedValue({ getTracks: () => [{ stop: vi.fn() }] })
    vi.stubGlobal('navigator', { ...navigator, permissions: { query: vi.fn().mockResolvedValue(status) }, mediaDevices: { getUserMedia } })
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    render(<App />)
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy())
    await act(async () => {
      status.state = 'granted'
      status.dispatchEvent(new Event('change'))
    })
    await waitFor(() => expect(getUserMedia).toHaveBeenCalled())
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
  })

  it('reads a system-level block separately from a site block', async () => {
    const getUserMedia = vi.fn().mockRejectedValue(new DOMException('Permission denied by system', 'NotAllowedError'))
    vi.stubGlobal('navigator', { ...navigator, mediaDevices: { getUserMedia } })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Mở camera' }))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/Quyền riêng tư & Bảo mật/))
  })
})

describe('templates', () => {
  it('offers seven layouts and sizes each session to its photo count', async () => {
    vi.spyOn(photo, 'readImageFile').mockImplementation(async (file) => `data:image/jpeg;base64,${file.name}`)
    render(<App />)
    const modes = within(screen.getByRole('group', { name: 'Chế độ chụp' })).getAllByRole('button')
    expect(modes.map((mode) => mode.textContent)).toEqual(['1 tấm', 'Đôi', 'Dải 3', 'Dải 4', 'Lưới 4', 'Lưới 6', 'Cuộn film'])
    fireEvent.click(screen.getByRole('button', { name: 'Lưới 6' }))
    const files = Array.from({ length: 6 }, (_, index) => new File(['x'], `g${index}`, { type: 'image/jpeg' }))
    fireEvent.change(screen.getByLabelText('Chọn ảnh từ máy', { selector: 'input' }), { target: { files } })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Lưu ảnh' })).toBeTruthy())
    expect(screen.getByTestId('print').querySelectorAll('img')).toHaveLength(6)
  })

  it('switches between four-photo layouts after shooting, including film', async () => {
    vi.spyOn(photo, 'readImageFile').mockImplementation(async (file) => `data:image/jpeg;base64,${file.name}`)
    render(<App />)
    const files = Array.from({ length: 4 }, (_, index) => new File(['x'], `f${index}`, { type: 'image/jpeg' }))
    fireEvent.change(screen.getByLabelText('Chọn ảnh từ máy', { selector: 'input' }), { target: { files } })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Lưu ảnh' })).toBeTruthy())
    fireEvent.click(screen.getByRole('tab', { name: 'Bố cục' }))
    fireEvent.click(screen.getByRole('button', { name: /Cuộn film/ }))
    expect(screen.getByTestId('print').className).toMatch(/print--film-4/)
    expect(screen.getByTestId('print').querySelectorAll('.print__hole').length).toBeGreaterThan(20)
  })
})

describe('install', () => {
  it('opens in the mode a home-screen shortcut asks for', () => {
    window.history.pushState({}, '', '/?mode=single&source=shortcut')
    render(<App />)
    expect(screen.getByRole('button', { name: /1 tấm/, pressed: true })).toBeTruthy()
    window.history.pushState({}, '', '/')
  })

  it('offers the native install prompt when the browser allows it', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Cài đặt' }))
    expect(within(screen.getByRole('dialog')).queryByRole('button', { name: 'Cài app' })).toBeNull()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    const prompt = vi.fn().mockResolvedValue(undefined)
    const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
      prompt,
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    })
    act(() => {
      window.dispatchEvent(event)
    })
    expect(event.defaultPrevented).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Cài đặt' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cài app' }))
    const sheet = screen.getByRole('dialog')
    expect(within(sheet).getByText(/Giữ biểu tượng/)).toBeTruthy()
    await act(async () => {
      fireEvent.click(within(sheet).getByRole('button', { name: 'Cài ngay' }))
    })
    expect(prompt).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.getByRole('status').textContent).toMatch(/Đã cài moyoo/))
  })
})

describe('photo helpers', () => {
  it('formats stamp dates in local time', () => {
    const lateNight = new Date(2026, 10, 2, 0, 30)
    expect(photo.formatStampDate(lateNight)).toBe('2026.11.02')
    expect(photo.stampLabel('timestamp', '', lateNight)).toBe("'26.11.02 00:30")
    expect(photo.stampLabel('letterpress', '  Sài Gòn ', lateNight)).toBe('Sài Gòn • 2026.11.02')
    expect(photo.stampLabel('letterpress', '', lateNight)).toBe('moyoo studio • 2026.11.02')
    expect(photo.stampLabel('clean', 'ignored', lateNight)).toBe('moyoo studio')
  })

  it('captures the region inside the slot mask', () => {
    // 1280×960 landscape video in a 3:4 portrait box: visible width is 720px.
    const strip = photo.captureRect(1280, 960, { aspect: 592 / 390, boxAspect: 3 / 4, maskFraction: 0.86 })
    expect(strip.w).toBeCloseTo(720 * 0.86)
    expect(strip.w / strip.h).toBeCloseTo(592 / 390)
    expect(strip.x + strip.w / 2).toBeCloseTo(640)
    expect(strip.y + strip.h / 2).toBeCloseTo(480)

    // A mask anchored near the top of the box, measured on screen, is captured exactly;
    // the front camera is mirrored, so a left-side mask reads from the right of the video.
    const anchored = photo.captureRect(1280, 960, {
      aspect: 1,
      boxAspect: 3 / 4,
      mask: { x: 0.1, y: 0.05, w: 0.5, h: 0.375 },
      mirror: true,
    })
    expect(anchored.x).toBeCloseTo(280 + 0.4 * 720)
    expect(anchored.y).toBeCloseTo(0.05 * 960)
    expect(anchored.w).toBeCloseTo(360)
    expect(anchored.h).toBeCloseTo(360)

    const square = photo.captureRect(960, 1280, { aspect: 1, boxAspect: 3 / 4, maskFraction: 0.86 })
    expect(square.w).toBeCloseTo(960 * 0.86)
    expect(square.h).toBeCloseTo(square.w)
  })

  it('keeps one layout per template with the documented sizes', () => {
    expect(photo.getPrintLayout('strip-4')).toMatchObject({ width: 660, height: 1820 })
    expect(photo.getPrintLayout('grid-2x2').slots).toHaveLength(4)
    expect(photo.getPrintLayout('single').slots).toEqual([{ x: 40, y: 40, w: 720, h: 700 }])
    for (const option of templateOptions) {
      const layout = photo.getPrintLayout(option.id)
      expect(layout.slots).toHaveLength(option.count)
      layout.slots.forEach((slot) => {
        expect(slot.w / slot.h).toBeCloseTo(option.slotAspect, 2)
        expect(slot.x + slot.w).toBeLessThanOrEqual(layout.width)
        expect(slot.y + slot.h).toBeLessThan(layout.stampY)
      })
    }
  })
})
