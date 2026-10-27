import { useCallback, useEffect, useState } from 'react'
import { GridDecor, StarsDecor } from '../components/art'
import { Header } from '../components/Header'
import { Notice } from '../components/Notice'
import { SuccessModal } from '../components/SuccessModal'
import { steps } from '../config'
import { judgeToken } from '../game/tokens'
import { useLatest, useProgress, useWakeLock } from '../hooks'
import { CodeStep } from './CodeStep'
import { PianoStep } from './PianoStep'
import { QuestionStep } from './QuestionStep'
import { RaceStep } from './RaceStep'
import { ScanStep } from './ScanStep'
import { Treasure } from './Treasure'

// La partie : en-tête, écran de l'étape en cours et fenêtre de réussite.
// `incomingToken` : jeton d'un QR code ouvert avec l'appareil photo du téléphone (#/scan/<jeton>).
export function Game({ incomingToken, onTokenHandled }: { incomingToken: string | null; onTokenHandled: () => void }) {
  const [progress, setProgress] = useProgress()
  const [notice, setNotice] = useState<'early' | 'used' | null>(null)
  useWakeLock()

  const handleToken = useLatest((token: string) => {
    const verdict = judgeToken(token, progress)
    if (verdict === 'valid') {
      setNotice(null)
      setProgress({ ...progress, solved: true })
    } else if (verdict !== 'unknown') {
      setNotice(verdict)
    }
  })
  const onToken = useCallback((token: string) => handleToken.current(token), [handleToken])

  useEffect(() => {
    if (!incomingToken) return
    onToken(incomingToken)
    onTokenHandled()
  }, [incomingToken, onToken, onTokenHandled])

  const latestProgress = useLatest(progress)
  const solve = useCallback(() => setProgress({ ...latestProgress.current, solved: true }), [latestProgress, setProgress])
  const next = () => {
    setNotice(null)
    setProgress({ step: progress.step + 1, solved: false })
  }

  const index = progress.step
  const step = steps[index]
  return (
    <main className="screen">
      {index === 0 && <GridDecor />}
      {step.kind === 'treasure' && <StarsDecor />}
      <Header index={index} />
      {notice && <Notice kind={notice} onClose={() => setNotice(null)} />}
      {step.kind === 'code' && <CodeStep key={index} step={step} onSolved={solve} />}
      {step.kind === 'question' && <QuestionStep key={index} step={step} onSolved={solve} />}
      {step.kind === 'scan' && <ScanStep key={index} step={step} solved={progress.solved} onToken={onToken} />}
      {step.kind === 'melody' && <PianoStep key={index} step={step} solved={progress.solved} onSolved={solve} />}
      {step.kind === 'race' && <RaceStep key={index} step={step} onSolved={solve} />}
      {step.kind === 'treasure' && <Treasure step={step} />}
      {progress.solved && step.kind !== 'treasure' && <SuccessModal index={index} onContinue={next} />}
    </main>
  )
}
