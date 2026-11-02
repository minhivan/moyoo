export type CameraErrorKey =
  | 'cameraDenied'
  | 'cameraSystemDenied'
  | 'cameraNotFound'
  | 'cameraBusy'
  | 'cameraInsecure'
  | 'cameraUnsupported'
  | 'cameraEmbedded'

export class CameraError extends Error {
  readonly key: CameraErrorKey
  readonly code: string

  constructor(key: CameraErrorKey, code: string, detail = '') {
    super(detail || code)
    this.key = key
    this.code = detail ? `${code} · ${detail}` : code
  }
}

export type BrowserFamily = 'chrome' | 'edge' | 'safari' | 'firefox' | 'ios' | 'android' | 'other'

export function detectBrowser(userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent): BrowserFamily {
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios'
  if (/Android/.test(userAgent)) return 'android'
  if (/Edg\//.test(userAgent)) return 'edge'
  if (/Firefox\//.test(userAgent)) return 'firefox'
  if (/Chrome\//.test(userAgent)) return 'chrome'
  if (/Safari\//.test(userAgent)) return 'safari'
  return 'other'
}

function errorName(error: unknown): string {
  if (error instanceof DOMException || error instanceof Error) return error.name
  return 'UnknownError'
}

function errorMessage(error: unknown): string {
  if (error instanceof DOMException || error instanceof Error) return error.message
  return ''
}

export function classifyCameraError(error: unknown): CameraError {
  if (error instanceof CameraError) return error
  const name = errorName(error)
  const message = errorMessage(error)
  if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') {
    // Chrome says "Permission denied by system" when macOS/Windows blocks the browser itself.
    if (/system/i.test(message)) return new CameraError('cameraSystemDenied', name, message)
    return new CameraError('cameraDenied', name, message)
  }
  if (name === 'NotReadableError' || name === 'TrackStartError' || name === 'AbortError') {
    return new CameraError('cameraBusy', name, message)
  }
  return new CameraError('cameraNotFound', name, message)
}

/** Errors worth retrying with looser constraints before giving up. */
const RETRYABLE = new Set(['OverconstrainedError', 'ConstraintNotSatisfiedError', 'NotReadableError', 'AbortError', 'TypeError'])

function isEmbedded(): boolean {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

/**
 * Opens the camera, loosening constraints step by step: some laptop and Android cameras
 * reject a preferred size or facing mode even as an "ideal".
 */
export async function openCameraStream(facingMode: 'user' | 'environment'): Promise<MediaStream> {
  if (typeof window !== 'undefined' && window.isSecureContext === false) {
    throw new CameraError('cameraInsecure', 'InsecureContext')
  }
  const devices = typeof navigator === 'undefined' ? undefined : navigator.mediaDevices
  if (!devices?.getUserMedia) throw new CameraError('cameraUnsupported', 'NoMediaDevices')

  const attempts: MediaStreamConstraints[] = [
    { audio: false, video: { facingMode, width: { ideal: 1280 }, height: { ideal: 960 } } },
    { audio: false, video: { facingMode } },
    { audio: false, video: true },
  ]
  let lastError: unknown
  for (const constraints of attempts) {
    try {
      return await devices.getUserMedia(constraints)
    } catch (error) {
      lastError = error
      if (!RETRYABLE.has(errorName(error))) break
    }
  }
  const classified = classifyCameraError(lastError)
  // Inside an iframe without allow="camera" the browser denies silently, with no prompt.
  if (classified.key === 'cameraDenied' && typeof window !== 'undefined' && isEmbedded()) {
    throw new CameraError('cameraEmbedded', classified.code)
  }
  if (classified.key === 'cameraNotFound' && devices.enumerateDevices) {
    try {
      const inputs = (await devices.enumerateDevices()).filter((device) => device.kind === 'videoinput')
      if (inputs.length === 0) return Promise.reject(new CameraError('cameraNotFound', 'NoVideoInput'))
    } catch {
      // Keep the original error.
    }
  }
  throw classified
}

type PermissionWatcher = {
  state: PermissionState | 'unknown'
  stop: () => void
}

/**
 * Reads the camera permission and reports changes, so the app can explain a block before
 * anyone taps, and open the camera by itself the moment access is switched back on.
 */
export async function watchCameraPermission(onChange: (state: PermissionState) => void): Promise<PermissionWatcher> {
  const permissions = typeof navigator === 'undefined' ? undefined : navigator.permissions
  if (!permissions?.query) return { state: 'unknown', stop: () => {} }
  try {
    const status = await permissions.query({ name: 'camera' as PermissionName })
    const handler = () => onChange(status.state)
    status.addEventListener?.('change', handler)
    return { state: status.state, stop: () => status.removeEventListener?.('change', handler) }
  } catch {
    // Firefox and older Safari cannot query the camera permission.
    return { state: 'unknown', stop: () => {} }
  }
}
