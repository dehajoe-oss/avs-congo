'use client'

import { useShop } from '@/lib/shopContext'
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export default function Toast() {
  const { toast } = useShop()

  if (!toast) return null

  const icons = {
    success: <CheckCircle2 size={18} color="#ea8025" />,
    error: <AlertCircle size={18} color="#ef4444" />,
    warning: <AlertTriangle size={18} color="#f59e0b" />,
    info: <Info size={18} color="#3b82f6" />,
  }

  const borderColors = {
    success: 'rgba(234, 128, 37, 0.4)',
    error: 'rgba(239, 68, 68, 0.4)',
    warning: 'rgba(245, 158, 11, 0.4)',
    info: 'rgba(59, 130, 246, 0.4)',
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 99999,
        background: '#0e1710',
        color: '#f3f4f6',
        border: `1px solid ${borderColors[toast.type] || borderColors.success}`,
        borderRadius: '16px',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7), 0 0 20px rgba(234, 128, 37, 0.15)',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.85rem',
        fontWeight: 600,
        fontFamily: "'Poppins', sans-serif",
        maxWidth: '380px',
        animation: 'fadeInUp 0.3s ease-out',
      }}
    >
      {icons[toast.type] || icons.success}
      <span>{toast.message}</span>
    </div>
  )
}
