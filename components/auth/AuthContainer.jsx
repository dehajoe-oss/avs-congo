'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useShop } from '@/lib/shopContext'
import { Mail } from 'lucide-react'
import api from '@/lib/api-client'
import GoogleAuthButton from './GoogleAuthButton'

// ── Palette AVS (reprend les codes du site : ocre #b47027 sur fond sombre) ──
const PRIMARY = '#b47027'
const PRIMARY_LIGHT = '#f0b35e'

function EyeIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open
        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
      }
    </svg>
  )
}

function getStrength(pwd) {
  if (!pwd) return 0
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score
}
const STRENGTH_LABELS = ['', 'Faible', 'Moyen', 'Bon', 'Fort']
const STRENGTH_COLORS = ['', '#dc2626', '#f59e0b', PRIMARY, '#22c55e']

// ── Conteneur auth à panneau coulissant, inspiré du projet CNIB ─────────────
// Deux routes (`/connexion`, `/inscription`) partagent ce composant via
// `initialMode`. Desktop : split 50/50 avec overlay qui glisse.
// Mobile : un seul formulaire affiché + bascule textuelle.
export default function AuthContainer({ initialMode = 'signin' }) {
  const isSignUpMode = initialMode === 'signup'
  const [isSignUp, setIsSignUp] = useState(isSignUpMode)

  const { login, currentUser } = useShop()
  const router = useRouter()
  const searchParams = useSearchParams()
  // Redirection post-login (?redirect=, posée par l'auto-logout 401).
  // On n'accepte que des chemins internes pour éviter l'open-redirect.
  const redirectParam = searchParams.get('redirect') || ''
  const redirectTo = redirectParam.startsWith('/') && !redirectParam.startsWith('//')
    ? redirectParam
    : '/mon-compte'

  useEffect(() => {
    setIsSignUp(initialMode === 'signup')
  }, [initialMode])

  // Déjà connecté → retour à l'espace client
  useEffect(() => {
    if (currentUser) router.replace(redirectTo)
  }, [currentUser, router, redirectTo])

  // ── États connexion ──
  const [loginId, setLoginId] = useState('')
  const [loginPwd, setLoginPwd] = useState('')
  const [showLogPwd, setShowLogPwd] = useState(false)
  const [loginErr, setLoginErr] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginUnverifiedEmail, setLoginUnverifiedEmail] = useState('')

  // ── États inscription (champs alignés sur l'API AVS : nom + téléphone + email obligatoire) ──
  const [regForm, setRegForm] = useState({
    fullName: '', phone: '', email: '', password: '', password2: '',
  })
  const [userType, setUserType] = useState('breeder')
  const [companyName, setCompanyName] = useState('')
  const [showRegPwd, setShowRegPwd] = useState(false)
  const [showRegPwd2, setShowRegPwd2] = useState(false)
  const [regErr, setRegErr] = useState('')
  const [regFieldErrs, setRegFieldErrs] = useState({})
  const [regLoading, setRegLoading] = useState(false)
  const [terms, setTerms] = useState(false)

  // ── État confirmation par email obligatoire ──
  const [verificationPendingEmail, setVerificationPendingEmail] = useState('')
  const [devVerifyUrl, setDevVerifyUrl] = useState('')
  const [resendStatus, setResendStatus] = useState({ loading: false, message: '', error: '' })

  const handleRegSet = (k) => (e) => {
    setRegForm((f) => ({ ...f, [k]: e.target.value }))
    if (regFieldErrs[k]) setRegFieldErrs((fe) => ({ ...fe, [k]: '' }))
  }

  const strength = getStrength(regForm.password)

  const handleResendVerification = async (targetEmail) => {
    const emailToSend = (targetEmail || verificationPendingEmail || loginUnverifiedEmail || loginId).trim()
    if (!emailToSend) return
    setResendStatus({ loading: true, message: '', error: '' })
    try {
      let res
      try {
        res = await api.auth.resendVerification(emailToSend)
      } catch (apiErr) {
        const fallback = await fetch('/api/auth/resend-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToSend, identifier: emailToSend }),
        })
        res = await fallback.json()
      }
      const devUrl = res?.data?.devVerifyUrl || res?.devVerifyUrl
      if (devUrl) setDevVerifyUrl(devUrl)
      setResendStatus({
        loading: false,
        message: res?.message || `Un nouveau lien de validation a été envoyé à ${emailToSend}.`,
        error: '',
      })
    } catch (err) {
      setResendStatus({
        loading: false,
        message: '',
        error: err.message || 'Impossible de renvoyer l’email pour le moment.',
      })
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const identifier = loginId.trim()
    if (!identifier || !loginPwd) {
      setLoginErr('Veuillez remplir tous les champs.')
      return
    }
    setLoginLoading(true)
    setLoginErr('')
    setLoginUnverifiedEmail('')
    setResendStatus({ loading: false, message: '', error: '' })

    try {
      const result = await api.auth.login({
        identifier,
        email: identifier.includes('@') ? identifier : undefined,
        phone: !identifier.includes('@') ? identifier : undefined,
        password: loginPwd,
      })
      const user = result?.data?.user || result?.user
      const token = result?.data?.token || result?.token
      if (user) {
        login(user, token)
        router.push(redirectTo)
      } else {
        setLoginErr(result?.message || 'Connexion réussie.')
      }
    } catch (err) {
      const msg = err.message || ''
      const lower = msg.toLowerCase()
      if (lower.includes('valid') || lower.includes('activ') || lower.includes('confirm')) {
        setLoginUnverifiedEmail(identifier.includes('@') ? identifier : '')
      }
      setLoginErr(msg || 'Identifiants invalides ou serveur injoignable.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setRegErr('')
    setRegFieldErrs({})

    const fe = {}
    if (!regForm.fullName.trim()) fe.fullName = 'Le nom complet est obligatoire.'
    if (!regForm.phone.trim()) fe.phone = 'Le téléphone WhatsApp est obligatoire.'
    if (!regForm.email.trim()) {
      fe.email = 'L’adresse email est obligatoire pour activer votre compte.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email.trim())) {
      fe.email = 'Adresse email invalide.'
    }
    if (!regForm.password) fe.password = 'Le mot de passe est obligatoire.'
    else if (regForm.password.length < 8) fe.password = 'Minimum 8 caractères.'
    else if (!/[A-Za-z]/.test(regForm.password) || !/[0-9]/.test(regForm.password)) {
      fe.password = 'Lettres et chiffres requis.'
    }
    if (!regForm.password2) fe.password2 = 'Veuillez confirmer le mot de passe.'
    else if (regForm.password !== regForm.password2) {
      fe.password2 = 'Les mots de passe ne correspondent pas.'
    }
    if (!terms) {
      setRegErr("Veuillez accepter les conditions d'utilisation.")
      return
    }
    if (Object.keys(fe).length > 0) {
      setRegFieldErrs(fe)
      return
    }

    setRegLoading(true)
    try {
      const displayName = userType === 'company' && companyName.trim()
        ? `${regForm.fullName.trim()} — ${companyName.trim()}`
        : regForm.fullName.trim()
      const emailToRegister = regForm.email.trim()

      const result = await api.auth.register({
        name: displayName,
        fullName: displayName,
        phone: regForm.phone.trim(),
        email: emailToRegister,
        password: regForm.password,
      })

      // L'utilisateur doit impérativement valider son email avant de se connecter
      const devUrl = result?.data?.devVerifyUrl || result?.devVerifyUrl
      if (devUrl) setDevVerifyUrl(devUrl)
      setVerificationPendingEmail(emailToRegister)
    } catch (err) {
      setRegErr(err.message || 'Inscription impossible pour le moment.')
    } finally {
      setRegLoading(false)
    }
  }

  const switchToSignUp = () => {
    setIsSignUp(true)
    router.replace('/inscription')
  }

  const switchToSignIn = () => {
    setIsSignUp(false)
    router.replace('/connexion')
  }

  return (
    <div className="auth-page" style={styles.page}>
      <style>{`
        @media (max-width: 768px) {
          .auth-page {
            height: auto !important;
            min-height: 100vh !important;
            padding: 100px 16px 40px !important;
          }
          .auth-container {
            height: auto !important;
            min-height: auto !important;
            border-radius: 20px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
          }
          .auth-form-box {
            width: 100% !important;
            position: relative !important;
            transform: none !important;
            opacity: 1 !important;
          }
          .auth-hide-mobile {
            display: none !important;
          }
          .auth-form-content {
            padding: 32px 20px !important;
          }
          .auth-overlay-box {
            display: none !important;
          }
          .auth-mobile-toggle {
            display: block !important;
            text-align: center;
            margin-top: 18px;
            font-size: 13px;
            color: #64748b;
          }
          .auth-mobile-toggle-btn {
            color: ${PRIMARY};
            font-weight: 700;
            cursor: pointer;
            margin-left: 4px;
          }
        }
      `}</style>

      <Link href="/" style={styles.homeBtn}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
        </svg>
        <span>Accueil</span>
      </Link>

      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      <div className="auth-container" style={styles.container}>

        {/* FORMULAIRE INSCRIPTION */}
        <div
          className={`auth-form-box ${!isSignUp ? 'auth-hide-mobile' : ''}`}
          style={{
            ...styles.formContainer,
            ...styles.signUpContainer,
            ...(isSignUp
              ? { transform: 'translateX(100%)', opacity: 1, zIndex: 5 }
              : { transform: 'translateX(0%)', opacity: 0, zIndex: 1 }),
          }}
        >
          <div className="auth-form-content" style={styles.formContent}>
            {verificationPendingEmail ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(180, 112, 39, 0.15)',
                  border: '1px solid rgba(180, 112, 39, 0.35)',
                  color: '#b47027',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Mail size={32} />
                </div>
                <h2 style={{ ...styles.title, marginBottom: '6px' }}>Vérifiez votre boîte mail !</h2>
                <p style={{ ...styles.subtitle, marginBottom: '14px' }}>
                  Un lien d’activation a été envoyé à l’adresse :
                </p>
                <div style={{
                  padding: '9px 14px',
                  background: 'rgba(180, 112, 39, 0.12)',
                  border: '1px solid rgba(180, 112, 39, 0.28)',
                  borderRadius: '10px',
                  fontWeight: 700,
                  color: '#b47027',
                  display: 'inline-block',
                  marginBottom: '16px',
                  fontSize: '13px',
                  wordBreak: 'break-all',
                }}>
                  {verificationPendingEmail}
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Cliquez sur le lien contenu dans l’email pour valider votre adresse et activer votre compte. Pensez à vérifier également votre dossier de courriers indésirables (spams).
                </p>

                {resendStatus.message && (
                  <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
                    {resendStatus.message}
                  </div>
                )}
                {resendStatus.error && (
                  <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#ef4444', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
                    {resendStatus.error}
                  </div>
                )}

                {devVerifyUrl && (
                  <div style={{
                    margin: '0 0 16px',
                    padding: '12px 14px',
                    background: 'rgba(180, 112, 39, 0.12)',
                    border: '1px dashed #b47027',
                    borderRadius: '10px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '11px', color: '#b47027', fontWeight: 700, marginBottom: '6px' }}>
                      ⚡ Lien d’activation direct (mode test) :
                    </div>
                    <Link
                      href={devVerifyUrl}
                      style={{ fontSize: '12px', color: '#ffffff', textDecoration: 'underline', fontWeight: 600, wordBreak: 'break-all' }}
                    >
                      Valider mon adresse email maintenant &rarr;
                    </Link>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleResendVerification(verificationPendingEmail)}
                    disabled={resendStatus.loading}
                    style={{
                      ...styles.button,
                      background: 'transparent',
                      border: '1px solid #b47027',
                      color: '#b47027',
                      cursor: resendStatus.loading ? 'default' : 'pointer',
                    }}
                  >
                    {resendStatus.loading ? 'Envoi en cours…' : 'Renvoyer l’email d’activation'}
                  </button>
                  <button
                    type="button"
                    onClick={switchToSignIn}
                    style={styles.button}
                  >
                    Accéder à la connexion
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 style={styles.title}>Créer un compte</h2>
                <p style={styles.subtitle}>
                  Rejoignez les éleveurs & partenaires AVS à Pointe-Noire.
                </p>

                <GoogleAuthButton
                  mode="signup"
                  text="S'inscrire avec Google"
                  redirectTo={redirectTo}
                />

                <div style={styles.divider}>
                  <div style={styles.dividerLine} />
                  <span style={styles.dividerText}>ou avec votre numéro / email</span>
                  <div style={styles.dividerLine} />
                </div>

                {regErr && <div style={styles.errorBox}>{regErr}</div>}

                <form style={styles.form} onSubmit={handleRegisterSubmit} suppressHydrationWarning>
                  {/* Type de compte */}
                  <div style={styles.row}>
                    <button
                      type="button"
                      onClick={() => setUserType('breeder')}
                      style={{
                        ...styles.typeBtn,
                        ...(userType === 'breeder' ? styles.typeBtnActive : {}),
                      }}
                    >
                      🐥 Éleveur
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('company')}
                      style={{
                        ...styles.typeBtn,
                        ...(userType === 'company' ? styles.typeBtnActive : {}),
                      }}
                    >
                      🏢 Entreprise
                    </button>
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Nom complet ou raison sociale *</label>
                    <input
                      suppressHydrationWarning
                      style={{
                        ...styles.input,
                        ...(regFieldErrs.fullName ? styles.inputError : {}),
                      }}
                      type="text"
                      placeholder="Ex : Jean Bissooua ou Ferme de Loandjili"
                      value={regForm.fullName}
                      onChange={handleRegSet('fullName')}
                    />
                    {regFieldErrs.fullName && <span style={styles.fieldErr}>{regFieldErrs.fullName}</span>}
                  </div>

                  {userType === 'company' && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Nom de l’exploitation (optionnel)</label>
                      <input
                        suppressHydrationWarning
                        style={styles.input}
                        type="text"
                        placeholder="Ex : Ferme Avicole de Tié-Tié"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                  )}

                  <div style={styles.row}>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Téléphone WhatsApp *</label>
                      <input
                        suppressHydrationWarning
                        style={{
                          ...styles.input,
                          ...(regFieldErrs.phone ? styles.inputError : {}),
                        }}
                        type="tel"
                        placeholder="06 123 45 67"
                        value={regForm.phone}
                        onChange={handleRegSet('phone')}
                      />
                      {regFieldErrs.phone && <span style={styles.fieldErr}>{regFieldErrs.phone}</span>}
                    </div>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Adresse email (activation requise) *</label>
                      <input
                        suppressHydrationWarning
                        style={{
                          ...styles.input,
                          ...(regFieldErrs.email ? styles.inputError : {}),
                        }}
                        type="email"
                        placeholder="vous@email.com"
                        value={regForm.email}
                        onChange={handleRegSet('email')}
                      />
                      {regFieldErrs.email && <span style={styles.fieldErr}>{regFieldErrs.email}</span>}
                    </div>
                  </div>

                  <div style={styles.row}>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Mot de passe *</label>
                      <div style={styles.inputWrap}>
                        <input
                          suppressHydrationWarning
                          style={{
                            ...styles.input,
                            paddingRight: '38px',
                            ...(regFieldErrs.password ? styles.inputError : {}),
                          }}
                          type={showRegPwd ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={regForm.password}
                          onChange={handleRegSet('password')}
                        />
                        <button
                          type="button"
                          style={styles.eyeBtn}
                          onClick={() => setShowRegPwd(!showRegPwd)}
                          aria-label="Afficher le mot de passe"
                        >
                          <EyeIcon open={showRegPwd} />
                        </button>
                      </div>
                      {regFieldErrs.password && <span style={styles.fieldErr}>{regFieldErrs.password}</span>}
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Confirmation *</label>
                      <div style={styles.inputWrap}>
                        <input
                          suppressHydrationWarning
                          style={{
                            ...styles.input,
                            paddingRight: '38px',
                            ...(regFieldErrs.password2 ? styles.inputError : {}),
                          }}
                          type={showRegPwd2 ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={regForm.password2}
                          onChange={handleRegSet('password2')}
                        />
                        <button
                          type="button"
                          style={styles.eyeBtn}
                          onClick={() => setShowRegPwd2(!showRegPwd2)}
                          aria-label="Afficher la confirmation"
                        >
                          <EyeIcon open={showRegPwd2} />
                        </button>
                      </div>
                      {regFieldErrs.password2 && <span style={styles.fieldErr}>{regFieldErrs.password2}</span>}
                    </div>
                  </div>

                  {regForm.password && (
                    <div style={styles.strengthBox}>
                      <div style={styles.strengthBars}>
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            style={{
                              ...styles.strengthBar,
                              background: level <= strength
                                ? STRENGTH_COLORS[strength]
                                : 'rgba(180, 112, 39, 0.2)',
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ ...styles.strengthText, color: STRENGTH_COLORS[strength] }}>
                        {STRENGTH_LABELS[strength]}
                      </span>
                    </div>
                  )}

                  <label style={styles.termsLabel}>
                    <input
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                      style={styles.checkbox}
                    />
                    <span>
                      J&apos;accepte les <Link href="/contact" style={styles.termsLink}>conditions d&apos;utilisation</Link> d&apos;Agro Véto Services.
                    </span>
                  </label>

                  <button style={styles.button} type="submit" disabled={regLoading}>
                    {regLoading ? 'Inscription en cours...' : "S'inscrire"}
                  </button>

                  <div className="auth-mobile-toggle" style={styles.mobileToggle}>
                    Déjà un compte ? <span className="auth-mobile-toggle-btn" style={styles.mobileToggleBtn} onClick={switchToSignIn}>Se connecter</span>
                  </div>
                </form>
              </>
            )}
          </div>

        </div>

        {/* FORMULAIRE CONNEXION */}
        <div
          className={`auth-form-box ${isSignUp ? 'auth-hide-mobile' : ''}`}
          style={{
            ...styles.formContainer,
            ...styles.signInContainer,
            ...(isSignUp
              ? { transform: 'translateX(100%)', opacity: 0, zIndex: 1 }
              : { transform: 'translateX(0%)', opacity: 1, zIndex: 5 }),
          }}
        >
          <div className="auth-form-content" style={styles.formContent}>
            <h2 style={styles.title}>Connexion</h2>
            <p style={styles.subtitle}>Bon retour dans votre espace éleveur AVS.</p>

            <GoogleAuthButton
              mode="signin"
              text="Se connecter avec Google"
              redirectTo={redirectTo}
            />

            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>ou avec votre identifiant</span>
              <div style={styles.dividerLine} />
            </div>

            {loginErr && (
              <div style={styles.errorBox}>
                <div style={{ marginBottom: loginUnverifiedEmail ? '8px' : 0 }}>{loginErr}</div>
                {loginUnverifiedEmail && (
                  <div style={{ marginTop: '8px', borderTop: '1px dashed rgba(220,38,38,0.3)', paddingTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleResendVerification(loginUnverifiedEmail)}
                      disabled={resendStatus.loading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#b47027',
                        fontWeight: 700,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: 0,
                      }}
                    >
                      {resendStatus.loading ? 'Envoi en cours…' : 'Renvoyer le lien de validation'}
                    </button>
                    {resendStatus.message && (
                      <div style={{ color: '#10b981', marginTop: '6px', fontSize: '11px', fontWeight: 600 }}>
                        {resendStatus.message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <form style={styles.form} onSubmit={handleLoginSubmit} suppressHydrationWarning>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Téléphone WhatsApp ou Email *</label>
                <input
                  suppressHydrationWarning
                  style={styles.input}
                  type="text"
                  placeholder="06 123 45 67 ou vous@email.com"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  autoFocus={!isSignUp}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Mot de passe *</label>
                <div style={styles.inputWrap}>
                  <input
                    suppressHydrationWarning
                    style={{ ...styles.input, paddingRight: '38px' }}
                    type={showLogPwd ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={loginPwd}
                    onChange={(e) => setLoginPwd(e.target.value)}
                  />
                  <button
                    type="button"
                    style={styles.eyeBtn}
                    onClick={() => setShowLogPwd(!showLogPwd)}
                    aria-label="Afficher le mot de passe"
                  >
                    <EyeIcon open={showLogPwd} />
                  </button>
                </div>
              </div>

              <div style={styles.forgotRow}>
                <Link href="/mot-de-passe-oublie" style={styles.link}>
                  Mot de passe oublié ?
                </Link>
              </div>

              <button style={styles.button} type="submit" disabled={loginLoading}>
                {loginLoading ? 'Connexion en cours...' : 'Se connecter'}
              </button>

              <div className="auth-mobile-toggle" style={styles.mobileToggle}>
                Pas encore de compte ? <span className="auth-mobile-toggle-btn" style={styles.mobileToggleBtn} onClick={switchToSignUp}>Créer un compte</span>
              </div>
            </form>
          </div>
        </div>

        {/* OVERLAY SLIDING PANEL */}
        <div
          className="auth-overlay-box"
          style={{
            ...styles.overlayContainer,
            ...(isSignUp ? { transform: 'translateX(-100%)' } : { transform: 'translateX(0%)' }),
          }}
        >
          <div
            style={{
              ...styles.overlay,
              ...(isSignUp ? { transform: 'translateX(50%)' } : { transform: 'translateX(0%)' }),
            }}
          >
            <div
              style={{
                ...styles.overlayPanel,
                ...styles.overlayLeft,
                ...(isSignUp ? { transform: 'translateX(0)' } : { transform: 'translateX(-20%)' }),
              }}
            >
              <div style={styles.brandBadge}>
                <img src="/images/logo.webp" alt="Agro Véto Services" style={styles.logo} />
              </div>
              <h2 style={styles.overlayTitle}>Bon retour !</h2>
              <p style={styles.overlayText}>
                Suivez vos commandes d&apos;intrants, vos rendez-vous clinique 24/7 et vos formations ferme-école.
              </p>
              <button style={styles.ghostButton} onClick={switchToSignIn}>
                Se connecter
              </button>
            </div>

            <div
              style={{
                ...styles.overlayPanel,
                ...styles.overlayRight,
                ...(isSignUp ? { transform: 'translateX(20%)' } : { transform: 'translateX(0)' }),
              }}
            >
              <div style={styles.brandBadge}>
                <img src="/images/logo.webp" alt="Agro Véto Services" style={styles.logo} />
              </div>
              <h2 style={styles.overlayTitle}>Rejoignez AVS !</h2>
              <p style={styles.overlayText}>
                Compte express en 15 secondes : commandez poussins Cobb 500, provenderie et réservez votre visite vétérinaire.
              </p>
              <button style={styles.ghostButton} onClick={switchToSignUp}>
                Créer un compte
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const styles = {
  homeBtn: {
    position: 'absolute',
    top: '32px',
    left: '32px',
    zIndex: 200,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 22px',
    borderRadius: '9999px',
    background: '#ffffff',
    border: `1.5px solid ${PRIMARY}55`,
    color: '#0f172a',
    fontSize: '13.5px',
    fontWeight: 600,
    textDecoration: 'none',
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  },
  page: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#faf7f0',
    padding: '48px 0 40px',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  bgGlow1: {
    position: 'absolute',
    top: '-150px',
    right: '-150px',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${PRIMARY}26 0%, transparent 70%)`,
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute',
    bottom: '-150px',
    left: '-150px',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${PRIMARY}1f 0%, transparent 70%)`,
    pointerEvents: 'none',
  },
  container: {
    position: 'relative',
    width: 'min(1020px, 94vw)',
    minHeight: '640px',
    background: '#ffffff',
    borderRadius: '24px',
    border: `1px solid ${PRIMARY}44`,
    boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    zIndex: 1,
  },
  formContainer: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '50%',
    transition: 'all 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
  },
  signUpContainer: {
    left: 0,
    zIndex: 1,
    opacity: 0,
  },
  signInContainer: {
    left: 0,
    zIndex: 2,
  },
  formContent: {
    width: '100%',
    maxWidth: '460px',
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxSizing: 'border-box',
    margin: '0 auto',
  },
  title: {
    fontSize: '23px',
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: '12.5px',
    color: '#64748b',
    margin: '0 0 16px',
    fontWeight: 400,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: '10px 0 16px',
    gap: '12px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#e2e8f0',
  },
  dividerText: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#94a3b8',
    fontWeight: 600,
  },
  errorBox: {
    background: 'rgba(220,38,38,0.07)',
    border: '1px solid rgba(220,38,38,0.2)',
    borderRadius: '10px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#dc2626',
    marginBottom: '12px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px',
    minWidth: 0,
  },
  label: {
    fontSize: '10.5px',
    fontWeight: 700,
    color: '#64748b',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  inputWrap: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    background: '#ffffff',
    border: `1.5px solid ${PRIMARY}55`,
    borderRadius: '9px',
    padding: '9.5px 13px',
    fontSize: '13px',
    fontFamily: "'Poppins', sans-serif",
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
  },
  fieldErr: {
    fontSize: '11px',
    color: '#dc2626',
    marginTop: '4px',
  },
  typeBtn: {
    padding: '9px 8px',
    borderRadius: '10px',
    border: '1px solid rgba(0,0,0,0.12)',
    background: 'transparent',
    color: '#475569',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '10px',
    fontFamily: "'Poppins', sans-serif",
  },
  typeBtnActive: {
    border: `1px solid ${PRIMARY}`,
    background: `${PRIMARY}26`,
    color: PRIMARY,
  },
  forgotRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px',
    marginTop: '-2px',
  },
  link: {
    color: PRIMARY,
    fontSize: '12.5px',
    fontWeight: 600,
    textDecoration: 'none',
  },
  button: {
    borderRadius: '9999px',
    border: 'none',
    background: `linear-gradient(135deg, #7a4d1c, ${PRIMARY})`,
    color: '#ffffff',
    fontSize: '13.5px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    padding: '11.5px 24px',
    marginTop: '6px',
    cursor: 'pointer',
    boxShadow: `0 6px 20px ${PRIMARY}59`,
    fontFamily: "'Poppins', sans-serif",
  },
  strengthBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
    marginTop: '-2px',
  },
  strengthBars: {
    display: 'flex',
    gap: '4px',
    flex: 1,
  },
  strengthBar: {
    height: '3.5px',
    flex: 1,
    borderRadius: '2px',
  },
  strengthText: {
    fontSize: '11px',
    fontWeight: 600,
  },
  termsLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '10px',
    cursor: 'pointer',
    lineHeight: 1.45,
  },
  checkbox: {
    marginTop: '2px',
    accentColor: PRIMARY,
    cursor: 'pointer',
  },
  termsLink: {
    color: PRIMARY,
    fontWeight: 600,
    textDecoration: 'none',
  },
  mobileToggle: {
    display: 'none',
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
    marginTop: '16px',
  },
  mobileToggleBtn: {
    color: PRIMARY,
    fontWeight: 700,
    cursor: 'pointer',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '50%',
    height: '100%',
    overflow: 'hidden',
    transition: 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
    zIndex: 100,
  },
  overlay: {
    background: 'linear-gradient(135deg, #0a0d06 0%, #7a4d1c 55%, #b47027 100%)',
    position: 'relative',
    left: '-100%',
    height: '100%',
    width: '200%',
    transform: 'translateX(0)',
    transition: 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
    color: '#ffffff',
  },
  brandBadge: {
    marginBottom: '24px',
    background: 'rgba(255,255,255,0.94)',
    borderRadius: '16px',
    padding: '10px 18px',
    display: 'inline-flex',
  },
  logo: {
    height: '44px',
    width: 'auto',
    display: 'block',
  },
  overlayPanel: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 44px',
    textAlign: 'center',
    top: 0,
    height: '100%',
    width: '50%',
    transform: 'translateX(0)',
    transition: 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
    boxSizing: 'border-box',
  },
  overlayLeft: {
    transform: 'translateX(-20%)',
    left: 0,
  },
  overlayRight: {
    right: 0,
  },
  overlayTitle: {
    fontSize: '26px',
    fontWeight: 800,
    color: '#ffffff',
    margin: '0 0 12px',
  },
  overlayText: {
    fontSize: '14px',
    lineHeight: 1.75,
    color: 'rgba(255, 255, 255, 0.88)',
    margin: '0 0 28px',
    maxWidth: '300px',
    fontWeight: 300,
  },
  ghostButton: {
    borderRadius: '9999px',
    border: '2px solid rgba(255, 255, 255, 0.7)',
    background: 'rgba(255, 255, 255, 0.10)',
    color: '#ffffff',
    fontSize: '13.5px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    padding: '12px 42px',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
  },
}
