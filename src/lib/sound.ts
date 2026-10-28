/**
 * Synthesizes a crisp, luxury camera shutter sound using Web Audio API.
 * 100% offline, zero audio file dependencies, pleasant mechanical haptic feedback.
 */
export function playShutterSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    if (ctx.state === 'suspended') {
      void ctx.resume()
    }

    const t = ctx.currentTime

    // 1. Initial click (curtain opens)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(1400, t)
    osc1.frequency.exponentialRampToValueAtTime(150, t + 0.035)

    gain1.gain.setValueAtTime(0.35, t)
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.035)

    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(t)
    osc1.stop(t + 0.035)

    // 2. Mechanical clack (curtain closes)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(950, t + 0.055)
    osc2.frequency.exponentialRampToValueAtTime(90, t + 0.12)

    gain2.gain.setValueAtTime(0.45, t + 0.055)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.12)

    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(t + 0.055)
    osc2.stop(t + 0.12)
  } catch {
    // Gracefully ignore audio errors (e.g. user gesture restrictions)
  }
}

/**
 * Synthesizes a subtle, tactile mechanical click for UI button taps.
 */
export function playTapSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    if (ctx.state === 'suspended') {
      void ctx.resume()
    }

    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1800, t)
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.02)

    gain.gain.setValueAtTime(0.08, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(t)
    osc.stop(t + 0.02)
  } catch {
    // Gracefully ignore
  }
}

/**
 * Synthesizes the tactile, mechanical motorized film advance whirr between shots.
 */
export function playFilmAdvanceSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    if (ctx.state === 'suspended') {
      void ctx.resume()
    }

    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(420, t)
    osc.frequency.linearRampToValueAtTime(320, t + 0.14)

    gain.gain.setValueAtTime(0.08, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(t)
    osc.stop(t + 0.14)
  } catch {
    // Gracefully ignore
  }
}

