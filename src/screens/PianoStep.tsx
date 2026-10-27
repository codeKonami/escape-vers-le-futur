import { useEffect, useRef, useState } from 'react'
import { EarIcon, NoteGlyph, PlayIcon } from '../components/art'
import { melody, messages, type MelodyStep } from '../config'
import { devices } from '../devices'
import { hearNote, newMelody, resetMelody } from '../game/melody'
import { noteToMidi, type Tone } from '../game/pitch'

const expected = melody.events.map((event) => noteToMidi(event.note))
const toneColors: Record<Tone, string> = { red: '#FF5470', orange: '#FF9F1C', green: '#3DDC84' }
// Décalages verticaux décoratifs du design (sans rapport avec la vraie hauteur des notes).
const offsets = [22, 0, 40, 12]

// La mélodie secrète (étape 5) : écouter, puis la rejouer sur le vrai piano.
export function PianoStep({ step, solved, onSolved }: { step: MelodyStep; solved: boolean; onSolved: () => void }) {
  const [state, setState] = useState(() => newMelody(expected.length))
  const [listening, setListening] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [micDenied, setMicDenied] = useState(false)
  const playingRef = useRef(false)

  // Écoute du micro tant que le bouton oreille est actif.
  useEffect(() => {
    if (!listening || solved) return
    const source = devices.createNoteSource()
    source
      .start((midi) => {
        // Le téléphone ne s'écoute pas lui-même pendant qu'il joue la mélodie.
        if (!playingRef.current) setState((current) => hearNote(current, midi, expected, melody.octaveMatters))
      })
      .catch(() => {
        setMicDenied(true)
        setListening(false)
      })
    return () => source.stop()
  }, [listening, solved])

  // Fausse note : on montre sa couleur un instant, puis tout revient à zéro.
  useEffect(() => {
    if (state.resetting) {
      const timer = setTimeout(() => setState(resetMelody), 1200)
      return () => clearTimeout(timer)
    }
    if (state.done) {
      setListening(false)
      const timer = setTimeout(onSolved, 600)
      return () => clearTimeout(timer)
    }
  }, [state, onSolved])

  const play = async () => {
    if (playingRef.current) return
    playingRef.current = true
    setPlaying(true)
    try {
      await devices.melodyPlayer.play()
    } catch {
      // Son indisponible : rien à faire, on peut réessayer.
    } finally {
      playingRef.current = false
      setPlaying(false)
    }
  }

  const found = state.marks.filter((mark) => mark?.tone === 'green').length

  return (
    <>
      <div className="intro" style={{ marginTop: 4 }}>
        <h1 className="title">{step.title}</h1>
        <p className="lead" style={{ fontSize: 17 }}>
          {step.intro}
        </p>
      </div>

      <div className="melody">
        <div className="notes">
          {state.marks.map((mark, i) => {
            const current = listening && i === state.current
            const stroke = mark?.tone === 'green' ? toneColors.green : current ? '#FFB000' : '#CFCBEA'
            return (
              <div key={i} className="note" style={{ paddingTop: offsets[i % offsets.length] }} data-testid="note" data-tone={mark?.tone ?? ''}>
                <NoteGlyph id={`note-head-${i}`} level={mark?.level ?? 0} fill={mark ? toneColors[mark.tone] : 'transparent'} stroke={stroke} />
                <span className="note-label" style={{ color: mark ? toneColors[mark.tone] : '#A9A6C8' }}>
                  {mark?.label ?? ''}
                </span>
              </div>
            )
          })}
        </div>
        <p className="found" role="status">
          Notes trouvées : {found} / {expected.length}
        </p>
        {state.failed && (
          <p className="fail" role="alert">
            {step.fail}
          </p>
        )}
        {micDenied && (
          <p className="error" role="alert" style={{ textAlign: 'center' }}>
            {messages.micDenied}
          </p>
        )}
      </div>

      <div className="round-controls">
        <div className="round-control">
          <button type="button" className={playing ? 'round-button playing' : 'round-button'} aria-label="Écouter la mélodie" onClick={play}>
            <PlayIcon />
          </button>
          <span>Écouter</span>
        </div>
        <div className={listening ? 'round-control listening' : 'round-control'}>
          <button
            type="button"
            className={listening ? 'round-button listening' : 'round-button'}
            aria-label="Le téléphone écoute le piano"
            aria-pressed={listening}
            onClick={() => {
              setMicDenied(false)
              setListening(!listening)
            }}
          >
            <EarIcon color={listening ? '#3FE0FF' : '#F2F0FF'} />
          </button>
          <span>{listening ? "J'écoute…" : 'Jouer au piano'}</span>
        </div>
      </div>
    </>
  )
}
