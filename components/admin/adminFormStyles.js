// ── Styles de formulaires partagés des pages de création back-office ────────
// Mêmes codes visuels que les modals d'AdminClient (thème clair/sombre via T).
export const fLabel = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 600,
  marginBottom: '4px',
}

export const fInput = (T) => ({
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: `1px solid ${T.border}`,
  background: T.bg,
  color: T.textMain,
  fontSize: '0.88rem',
  fontFamily: "'Poppins', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
})

export const fGrid2 = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
}

export const fSubmit = {
  width: '100%',
  padding: '12px',
  borderRadius: 10,
  border: 'none',
  background: '#b47027',
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.9rem',
  cursor: 'pointer',
  marginTop: '0.5rem',
  fontFamily: "'Poppins', sans-serif",
}

export const fError = {
  background: 'rgba(220,38,38,0.07)',
  border: '1px solid rgba(220,38,38,0.2)',
  borderRadius: '10px',
  padding: '8px 12px',
  fontSize: '12px',
  color: '#dc2626',
  marginBottom: '4px',
}

export const fPage = (T) => ({
  minHeight: '100vh',
  background: T.bg,
  color: T.textMain,
  fontFamily: "'Poppins', sans-serif",
  padding: '3rem 1rem 4rem',
})

export const fCard = (T) => ({
  maxWidth: '620px',
  margin: '0 auto',
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: '20px',
  padding: '2rem',
})

export const fBack = (T) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  color: '#b47027',
  fontSize: '0.82rem',
  fontWeight: 600,
  textDecoration: 'none',
  marginBottom: '1.2rem',
})
