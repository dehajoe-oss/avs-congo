'use client'

import { useRef, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import api from '@/lib/api-client'

// ── Compression cliente avant envoi ─────────────────────────────────────────
// Le backend AVS n'a pas Cloudinary configuré : il stocke l'image en base64.
// On réduit donc en amont (max 1280px, JPEG 0.82) pour ne pas gonfler la BDD.
// Fichiers déjà légers (≤ 400 Ko) : envoyés tels quels.
async function compressImage(file, maxDim = 1280, quality = 0.82) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Seules les images sont acceptées (JPEG, PNG, WEBP, GIF).')
  }
  if (file.size <= 400 * 1024) return file
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height))
  if (scale === 1 && file.type === 'image/jpeg') return file
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bmp.width * scale))
  canvas.height = Math.max(1, Math.round(bmp.height * scale))
  canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Compression impossible.'))), 'image/jpeg', quality)
  )
  return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
}

// ── Bouton "Choisir un fichier" ─────────────────────────────────────────────
// Props : onUploaded(url), folder (dossier Cloudinary le jour où configuré).
export default function ImageUploadButton({ onUploaded, folder = 'avs-uploads' }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const optimized = await compressImage(file)
      const res = await api.uploads.image(optimized, folder)
      const url = res?.data?.url
      if (!url) throw new Error("Réponse d'upload invalide.")
      onUploaded(url)
    } catch (err) {
      setError(err.message || "Échec de l'envoi.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 14px',
            borderRadius: 10,
            border: '1px solid rgba(180, 112, 39, 0.45)',
            background: 'rgba(180, 112, 39, 0.12)',
            color: '#b47027',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: busy ? 'default' : 'pointer',
            opacity: busy ? 0.7 : 1,
            whiteSpace: 'nowrap',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {busy ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={15} />}
          {busy ? 'Envoi…' : 'Choisir un fichier'}
        </button>
      </span>
      {error && <span style={{ fontSize: '11px', color: '#dc2626' }}>{error}</span>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  )
}
