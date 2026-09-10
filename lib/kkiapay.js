// lib/kkiapay.js
// Intégration officielle du Widget KKiaPay (Mobile Money & Carte Bancaire)

export const KKIAPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_KKIAPAY_KEY || 'da52a61056cd11f193801de6de503f5f'

let sdkPromise = null

/**
 * Charge dynamiquement le script CDN KKiaPay
 */
export function loadKkiapaySdk() {
  if (typeof window === 'undefined') return Promise.resolve(false)

  if (window.openKkiapayWidget) {
    return Promise.resolve(true)
  }

  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve) => {
    // Vérifier si le script est déjà présent dans le DOM
    const existing = document.querySelector('script[src*="kkiapay.me"]')
    if (existing) {
      if (window.openKkiapayWidget) {
        resolve(true)
        return
      }
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.kkiapay.me/k.js'
    script.async = true
    script.crossOrigin = 'anonymous'

    script.onload = () => {
      // Petite attente pour l'initialisation interne des custom elements
      setTimeout(() => {
        resolve(typeof window.openKkiapayWidget === 'function')
      }, 300)
    }

    script.onerror = () => {
      console.warn('[KKiaPay] Impossible de charger le SDK distant depuis cdn.kkiapay.me')
      resolve(false)
    }

    document.head.appendChild(script)
  })

  return sdkPromise
}

/**
 * Ouvre le widget KKiaPay pour régler une commande
 */
export async function openKkiapayPayment({
  amount,
  name,
  phone,
  email,
  orderNumber,
  data = '',
  sandbox = true,
  onSuccess,
  onFailed,
}) {
  const isLoaded = await loadKkiapaySdk()

  if (isLoaded && typeof window.openKkiapayWidget === 'function') {
    try {
      // Enregistrer les écouteurs d'événements officiels
      if (typeof window.addSuccessListener === 'function') {
        window.addSuccessListener((response) => {
          console.log('[KKiaPay Success]', response)
          if (onSuccess) onSuccess(response)
        })
      }

      if (typeof window.addFailedListener === 'function') {
        window.addFailedListener((err) => {
          console.warn('[KKiaPay Failed]', err)
          if (onFailed) onFailed(err)
        })
      }

      window.openKkiapayWidget({
        amount: Math.round(amount),
        key: KKIAPAY_PUBLIC_KEY,
        sandbox: sandbox,
        name: name || 'Client AVS',
        phone: phone ? phone.replace(/[\s.-]/g, '') : '',
        email: email || '',
        data: data || orderNumber,
        reason: `Commande AVS ${orderNumber || ''}`,
      })
      return true
    } catch (err) {
      console.error('[KKiaPay Open Widget Error]', err)
      return false
    }
  }

  return false
}
