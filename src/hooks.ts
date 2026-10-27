import { useCallback, useEffect, useRef, useState } from 'react'
import { loadProgress, saveProgress, storageKey, type Progress } from './game/progress'

// Progression sauvegardée dans le téléphone. Si un QR code est ouvert dans un autre
// onglet (appareil photo natif), cet onglet se met à jour tout seul.
export function useProgress(): [Progress, (next: Progress) => void] {
  const [progress, setProgress] = useState(loadProgress)
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey) setProgress(loadProgress())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  const update = useCallback((next: Progress) => {
    saveProgress(next)
    setProgress(next)
  }, [])
  return [progress, update]
}

// Garde l'écran allumé pendant la partie (si le navigateur le permet).
export function useWakeLock() {
  useEffect(() => {
    let lock: WakeLockSentinel | null = null
    const request = () => {
      if (document.visibilityState !== 'visible' || !('wakeLock' in navigator)) return
      navigator.wakeLock.request('screen').then((sentinel) => (lock = sentinel), () => {})
    }
    request()
    document.addEventListener('visibilitychange', request)
    return () => {
      document.removeEventListener('visibilitychange', request)
      void lock?.release()
    }
  }, [])
}

// Toujours la dernière version d'une fonction, utile dans les callbacks de longue durée.
export function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}
