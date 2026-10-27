import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { kids, melody, productionUrl, steps, type Step } from '../config'
import { frenchNoteName } from '../game/pitch'
import { saveProgress } from '../game/progress'
import { vaultCode } from '../game/steps'
import { scanUrl } from '../game/tokens'

type Card = { title: string; where: string; url?: string; code?: string }

const firstCode = steps.find((step) => step.kind === 'code')?.code ?? ''

// Cartes à imprimer : QR de départ, code secret, puis un QR par étape « scan ».
const cards: Card[] = [
  { title: 'Départ', where: `Sous l'oreiller de ${kids.first}`, url: productionUrl },
  { title: 'Code secret', where: `Sous l'oreiller de ${kids.second}`, code: firstCode },
  ...steps.flatMap((step) => (step.kind === 'scan' ? [{ title: step.card.title, where: step.card.where, url: scanUrl(step.token) }] : [])),
]

function solution(step: Step): string {
  switch (step.kind) {
    case 'code':
      return step.code
    case 'question':
      return step.answers.join(' · ')
    case 'scan':
      return `QR code caché : ${step.card.where.toLowerCase()}`
    case 'melody':
      return melody.events.map((event) => `${frenchNoteName(event.note)} (${event.note})`).join(', ')
    case 'race':
      return 'Atteindre 88 mph sans toucher une jeep (15 secondes)'
    case 'treasure':
      return step.hint
  }
}

function QrImage({ url, label }: { url: string; label: string }) {
  const [src, setSrc] = useState('')
  useEffect(() => {
    QRCode.toDataURL(url, { width: 600, margin: 1, errorCorrectionLevel: 'M' }).then(setSrc, () => setSrc(''))
  }, [url])
  return src ? <img src={src} alt={`QR code : ${label}`} data-url={url} /> : <div style={{ width: 160, height: 160 }} />
}

// Espace parent (#/parent) : cartes à imprimer, solutions et outils de test.
export function Parent() {
  const [target, setTarget] = useState(0)

  const goTo = (step: number) => {
    saveProgress({ step, solved: false })
    window.location.hash = '#/'
  }
  const restart = () => {
    if (window.confirm('Recommencer la partie depuis le début ?')) goTo(0)
  }

  return (
    <main className="parent">
      <div className="parent-inner">
        <header>
          <span className="brand">CHRONO·MISSION</span>
          <h1>Espace parent</h1>
          <p className="lead">
            Imprimez les cartes, cachez les QR codes aux endroits indiqués, glissez les deux premières cartes sous les oreillers : la mission peut commencer.
          </p>
          <div className="parent-actions" style={{ marginTop: 8 }}>
            <button type="button" className="primary" onClick={() => window.print()}>
              Imprimer les cartes
            </button>
            <a className="outline" href="#/">
              Ouvrir le jeu
            </a>
          </div>
        </header>

        <section className="print-cards" aria-labelledby="cartes">
          <h2 id="cartes">Cartes à imprimer</h2>
          <div className="cards">
            {cards.map((card) => (
              <article key={card.title} className="card">
                <h3>{card.title}</h3>
                <p>{card.where}</p>
                {card.url && <QrImage url={card.url} label={card.title} />}
                {card.code && <p className="card-code">{card.code}</p>}
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="solutions">
          <h2 id="solutions">Solutions</h2>
          <ol className="solutions">
            {steps.map((step, i) => (
              <li key={i}>
                <strong>{step.title}</strong> : {solution(step)}
              </li>
            ))}
          </ol>
          <p className="vault-line">
            Code du coffre affiché à la fin : <span data-testid="parent-vault">{vaultCode}</span>
          </p>
        </section>

        <section aria-labelledby="tester">
          <h2 id="tester">Tester la partie</h2>
          <label htmlFor="goto">Aller directement à l'étape</label>
          <div className="parent-actions">
            <select id="goto" value={target} onChange={(event) => setTarget(Number(event.target.value))}>
              {steps.map((step, i) => (
                <option key={i} value={i}>
                  {i + 1}. {step.title}
                </option>
              ))}
            </select>
            <button type="button" className="outline" onClick={() => goTo(target)}>
              Aller à l'étape
            </button>
            <button type="button" className="outline" onClick={restart}>
              Recommencer la partie
            </button>
          </div>
          <p className="parent-hint">Cette page affiche les solutions : gardez son adresse pour vous.</p>
        </section>
      </div>
    </main>
  )
}
