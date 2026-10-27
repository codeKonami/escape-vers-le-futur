import { useState } from 'react'
import { AlertIcon, BackspaceIcon } from '../components/art'
import type { CodeStep as Step } from '../config'

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

// Clavier numérique façon machine, avec afficheur LCD (étapes 1 et 4).
export function CodeStep({ step, onSolved }: { step: Step; onSolved: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const full = value.length === step.code.length

  const press = (digit: string) => {
    if (value.length < step.code.length) {
      setValue(value + digit)
      setError(false)
    }
  }
  const submit = () => {
    if (value === step.code) return onSolved()
    setError(true)
    setValue('')
  }

  return (
    <>
      <div className="intro">
        <h1 className="title">{step.title}</h1>
        <p className="lead">{step.intro}</p>
      </div>
      <div className={error ? 'lcd error' : 'lcd'}>
        <span className="lcd-label">{step.lcdLabel}</span>
        <div className="lcd-digits" role="status" aria-label={`${step.lcdLabel} : ${value || 'vide'}`} data-testid="lcd">
          {Array.from(step.code, (_, i) => (
            <span key={i} aria-hidden="true" className={value[i] !== undefined ? 'lcd-digit on' : 'lcd-digit'}>
              {value[i] ?? '8'}
            </span>
          ))}
        </div>
      </div>
      {error && (
        <div className="error-row" role="alert">
          <AlertIcon />
          <p className="error">{step.error}</p>
        </div>
      )}
      <div className="keypad">
        {keys.map((key) => (
          <button key={key} type="button" className="key" onClick={() => press(key)}>
            {key}
          </button>
        ))}
        <span />
        <button type="button" className="key" onClick={() => press('0')}>
          0
        </button>
        <button type="button" className="key" aria-label="Effacer" onClick={() => setValue(value.slice(0, -1))}>
          <BackspaceIcon />
        </button>
      </div>
      <button type="button" className="primary bottom" disabled={!full} onClick={submit}>
        {step.button}
      </button>
    </>
  )
}
