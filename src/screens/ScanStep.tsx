import { messages, type ScanStep as Step } from '../config'
import { ScanFrame } from '../components/ScanFrame'
import { tokenFromText } from '../game/tokens'

// Énigme + QR code caché à scanner (étapes 3 et 7).
export function ScanStep({ step, solved, onToken }: { step: Step; solved: boolean; onToken: (token: string) => void }) {
  return (
    <>
      <h1 className="title" style={{ marginTop: 4 }}>
        {step.title}
      </h1>
      <div className="panel">
        <span className="panel-label">MESSAGE INTERCEPTÉ</span>
        <p className="question" style={{ fontSize: 20, lineHeight: 1.45 }}>
          {step.riddle}
        </p>
      </div>
      <div className="scan-area">
        <ScanFrame
          active={!solved}
          onText={(text) => {
            const token = tokenFromText(text)
            if (token) onToken(token)
          }}
        />
      </div>
      <p className="scan-help">{messages.scanHelp}</p>
    </>
  )
}
