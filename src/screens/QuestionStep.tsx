import { useState, type FormEvent } from 'react'
import { PawIcon } from '../components/art'
import type { QuestionStep as Step } from '../config'
import { isAccepted } from '../game/answers'

// Question avec réponse à taper (étapes 2 et 6).
export function QuestionStep({ step, onSolved }: { step: Step; onSolved: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const empty = value.trim() === ''

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (empty) return
    if (isAccepted(value, step.answers)) onSolved()
    else setError(true)
  }

  return (
    <form className="screen-form" onSubmit={submit}>
      <h1 className="title">{step.title}</h1>
      <div className={step.icon ? 'panel with-icon' : 'panel'}>
        {step.icon === 'paw' && <PawIcon />}
        <p className="question">{step.question}</p>
      </div>
      <div className="field">
        <label htmlFor="answer">Votre réponse</label>
        <input
          id="answer"
          type="text"
          className={error ? 'error' : undefined}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setError(false)
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="done"
        />
      </div>
      {error && (
        <p className="error" role="alert">
          {step.error}
        </p>
      )}
      <button type="submit" className="primary bottom" disabled={empty}>
        Valider la réponse
      </button>
    </form>
  )
}
