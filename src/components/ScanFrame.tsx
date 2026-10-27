import { useEffect, useRef, useState } from 'react'
import { messages } from '../config'
import { devices } from '../devices'
import { useLatest } from '../hooks'

// Cadre de visée : la caméra arrière s'affiche dedans, avec les coins cyan et le balayage ambre.
export function ScanFrame({ active, onText }: { active: boolean; onText: (text: string) => void }) {
  const video = useRef<HTMLVideoElement>(null)
  const [denied, setDenied] = useState(false)
  const latestOnText = useLatest(onText)

  useEffect(() => {
    if (!active || !video.current) return
    const source = devices.createQrSource()
    source.start(video.current, (text) => latestOnText.current(text)).catch(() => setDenied(true))
    return () => source.stop()
  }, [active, latestOnText])

  return (
    <>
      <div className="scan-frame" aria-label="Viseur de la caméra">
        <video ref={video} muted playsInline />
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <span className="scan-beam" />
      </div>
      {denied && (
        <p className="error" role="alert">
          {messages.cameraDenied}
        </p>
      )}
    </>
  )
}
