import { PitchDetector } from 'pitchy'
import { NoteDetector } from '../game/noteDetector'
import type { NoteSource } from './types'

// Écoute le micro et repère la hauteur des notes avec pitchy (méthode McLeod).
export function createMicrophone(): NoteSource {
  let stopped = false
  let stream: MediaStream | null = null
  let context: AudioContext | null = null
  let timer = 0

  function stop() {
    stopped = true
    clearInterval(timer)
    stream?.getTracks().forEach((track) => track.stop())
    void context?.close()
    stream = null
    context = null
  }

  return {
    async start(onNote) {
      stopped = false
      // Traitements du téléphone désactivés : ils déforment le son du piano.
      const media = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      if (stopped) return media.getTracks().forEach((track) => track.stop())
      stream = media
      const audio = new AudioContext()
      context = audio
      await audio.resume()
      if (stopped) return
      const analyser = audio.createAnalyser()
      analyser.fftSize = 2048
      audio.createMediaStreamSource(media).connect(analyser)
      const pitch = PitchDetector.forFloat32Array(analyser.fftSize)
      const buffer = new Float32Array(analyser.fftSize)
      const detector = new NoteDetector(onNote)
      timer = window.setInterval(() => {
        analyser.getFloatTimeDomainData(buffer)
        let sum = 0
        for (const sample of buffer) sum += sample * sample
        const [frequency, clarity] = pitch.findPitch(buffer, audio.sampleRate)
        detector.push({ time: performance.now(), rms: Math.sqrt(sum / buffer.length), frequency, clarity })
      }, 20)
    },
    stop,
  }
}
