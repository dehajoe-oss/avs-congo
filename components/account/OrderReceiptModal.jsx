'use client'

import { useRef, useState } from 'react'
import { X, Download, FileText, CheckCircle2, ShieldCheck, Printer, Image as ImageIcon } from 'lucide-react'

export default function OrderReceiptModal({ order, onClose }) {
  const receiptRef = useRef(null)
  const [downloading, setDownloading] = useState(null)

  if (!order) return null

  const items = Array.isArray(order.items) ? order.items : []
  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const isPaid = order.paymentStatus === 'PAID'
  const totalAmount = Number(order.totalAmount || 0).toLocaleString('fr-FR')

  const downloadPDF = async () => {
    if (!receiptRef.current) return
    setDownloading('pdf')
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = 210
      const pageHeight = 297
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight))
      pdf.save(`Recu_${order.orderNumber || 'AVS'}.pdf`)
    } catch (err) {
      console.error('Erreur génération PDF reçu:', err)
      alert('Erreur lors du téléchargement du PDF.')
    } finally {
      setDownloading(null)
    }
  }

  const downloadPNG = async () => {
    if (!receiptRef.current) return
    setDownloading('png')
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `Recu_${order.orderNumber || 'AVS'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Erreur génération image reçu:', err)
      alert('Erreur lors du téléchargement de l’image.')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.2rem',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          background: '#181b19',
          border: '1px solid rgba(180, 112, 39, 0.35)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
        }}
      >
        {/* Barre d'action supérieure */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#111412',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#b47027" />
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f3f4f6' }}>
              Reçu officiel — {order.orderNumber}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={downloadPDF}
              disabled={downloading !== null}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '100px',
                background: '#b47027',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Download size={14} />
              <span>{downloading === 'pdf' ? 'Génération...' : 'Télécharger PDF'}</span>
            </button>

            <button
              onClick={downloadPNG}
              disabled={downloading !== null}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '100px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#f3f4f6',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <ImageIcon size={14} />
              <span>Image PNG</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#9ca3af',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginLeft: '4px',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Zone de prévisualisation scrollable */}
        <div style={{ overflowY: 'auto', padding: '1.5rem', background: '#262927', display: 'flex', justifyContent: 'center' }}>
          {/* LE REÇU OFFICIEL (Format document papier A4 capturé par html2canvas) */}
          <div
            ref={receiptRef}
            style={{
              width: '100%',
              maxWidth: '680px',
              background: '#ffffff',
              color: '#1e293b',
              padding: '40px 45px',
              borderRadius: '12px',
              fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              boxSizing: 'border-box',
            }}
          >
            {/* Liseré vertical de marque */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '7px', background: '#b47027', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }} />

            {/* En-tête Reçu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #b47027', paddingBottom: '20px', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src="/images/logo.webp"
                  alt="AVS Congo"
                  style={{ width: '56px', height: '56px', objectFit: 'contain' }}
                />
                <div>
                  <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                    AGRO VÉTO SERVICES CONGO
                  </h1>
                  <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                    Complexe Agropastoral & Clinique Vétérinaire 24/7
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                    Socoprise, Av. Nelson Mandela, Rue Bissoute — Pointe-Noire
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#b47027', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  REÇU D'ACHAT OFFICIEL
                </div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                  {order.orderNumber}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Date : {formattedDate}
                </div>
              </div>
            </div>

            {/* Informations Client & Livraison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#b47027', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  // CLIENT BÉNÉFICIAIRE
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  {order.customerName || 'Client AVS'}
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                  📞 {order.customerPhone}
                </div>
                {order.customerEmail && (
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    ✉️ {order.customerEmail}
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#b47027', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  // RÈGLEMENT & LIVRAISON
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '100px', background: isPaid ? '#dcfce7' : '#fef3c7', color: isPaid ? '#15803d' : '#b45309' }}>
                    {isPaid ? '✓ PAYÉ ACQUITTÉ' : 'EN ATTENTE'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                  Mode : {order.paymentMethod === 'kkiapay' ? 'Mobile Money (KKiaPay)' : order.paymentMethod || 'Comptoir'}
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                  📍 {order.customerAddress || 'Retrait au siège AVS'}
                </div>
              </div>
            </div>

            {/* Tableau des Articles */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#475569' }}>
                    Désignation de l'intrant / Prestation
                  </th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#475569', width: '60px' }}>
                    Qté
                  </th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#475569', width: '110px' }}>
                    Prix Unitaire
                  </th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#475569', width: '110px' }}>
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((it, idx) => {
                    const price = it.price || it.unitPrice || 0
                    const qty = it.quantity || 1
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px 12px', fontSize: '12px', color: '#1e293b' }}>
                          <strong>{it.name || it.title || 'Produit AVS'}</strong>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'center', color: '#b47027', fontWeight: 700 }}>
                          {qty}
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right', color: '#64748b' }}>
                          {Number(price).toLocaleString('fr-FR')} FCFA
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                          {Number(price * qty).toLocaleString('fr-FR')} FCFA
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 12px', fontSize: '12px' }}>Commande enregistrée</td>
                    <td style={{ textAlign: 'center', padding: '10px 12px' }}>1</td>
                    <td style={{ textAlign: 'right', padding: '10px 12px' }}>{totalAmount} FCFA</td>
                    <td style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>{totalAmount} FCFA</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totaux & Encadré Net Payé */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <div style={{ width: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12px', color: '#64748b' }}>
                  <span>Sous-total articles :</span>
                  <span>{totalAmount} FCFA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12px', color: '#64748b' }}>
                  <span>Frais de livraison :</span>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>Inclus / Siège</span>
                </div>
                <div style={{ borderTop: '2px solid #0f172a', margin: '8px 0 10px' }} />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#15271a',
                    color: '#ffffff',
                    padding: '10px 14px',
                    borderRadius: '8px',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>
                    Total Payé TTC :
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#f0b35e' }}>
                    {totalAmount} FCFA
                  </span>
                </div>
              </div>
            </div>

            {/* Cachet et signature numérique */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px dashed #cbd5e1' }}>
              <div style={{ fontSize: '10px', color: '#64748b', maxWidth: '340px', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>Mention légale :</div>
                Ce reçu officiel tient lieu de bon d'enlèvement et de preuve d'acquittement. Agro Véto Services Congo garantit la conformité sanitaire et la qualité certifiée des intrants fournis.
              </div>

              <div style={{ textAlign: 'center', minWidth: '160px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Pour la Direction Générale :</div>
                <div
                  style={{
                    border: '1.5px solid #b47027',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    background: '#fdfaf5',
                    fontSize: '10px',
                    color: '#b47027',
                    fontWeight: 800,
                  }}
                >
                  Dr M-R. E. Rakié POUTYA<br />
                  <span style={{ fontSize: '8px', fontWeight: 600, color: '#64748b' }}>Médecin Vétérinaire & QHSE</span>
                </div>
              </div>
            </div>

            {/* Pied de page */}
            <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '9px', color: '#94a3b8' }}>
              AGRO VÉTO SERVICES CONGO S.A.R.L.U. &bull; Téléphone : +242 05 633 70 50 / +242 06 967 75 67 &bull; Email : agrovetoservicescongo@gmail.com &bull; https://agrovetoservices.cg
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
