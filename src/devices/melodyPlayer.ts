import * as Tone from 'tone'
import { melody } from '../config'
import type { MelodyPlayer } from './types'

const releaseSeconds = 1.2
let synth: Tone.PolySynth | null = null

export const toneMelodyPlayer: MelodyPlayer = {
  async play() {
    await Tone.start() // doit être appelé pendant le clic sur « Écouter »
    // Un son simple, proche du piano : attaque nette puis extinction progressive.
    synth ??= new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.4, sustain: 0.2, release: releaseSeconds },
    }).toDestination()
    const instrument = synth

    const transport = Tone.getTransport()
    transport.stop()
    transport.cancel()
    transport.position = 0
    transport.bpm.value = melody.bpm

    const part = new Tone.Part((time, event) => {
      instrument.triggerAttackRelease(event.note, event.duration, time)
    }, melody.events).start(0)

    const end = Math.max(...melody.events.map((event) => Tone.Time(event.time).toSeconds() + Tone.Time(event.duration).toSeconds()))
    await new Promise<void>((resolve) => {
      transport.scheduleOnce(() => resolve(), end)
      transport.start()
    })
    // On laisse la dernière note s'éteindre, puis on remet tout à zéro pour pouvoir réécouter.
    await new Promise((resolve) => setTimeout(resolve, (releaseSeconds + 0.3) * 1000))
    transport.stop()
    transport.cancel()
    transport.position = 0
    part.dispose()
  },
}
