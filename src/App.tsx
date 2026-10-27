import { useCallback, useEffect, useState } from 'react'
import { tokenFromText } from './game/tokens'
import { Game } from './screens/Game'
import { Parent } from './screens/Parent'

// Routage par hash, compatible GitHub Pages : #/ (jeu), #/scan/<jeton> (QR code), #/parent.
export function App() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Une fois le QR code traité, l'adresse redevient #/ (un rechargement ne le rejoue pas).
  const clearToken = useCallback(() => {
    window.history.replaceState(null, '', '#/')
    setHash('#/')
  }, [])

  if (hash.startsWith('#/parent')) return <Parent />
  return <Game incomingToken={tokenFromText(hash)} onTokenHandled={clearToken} />
}
