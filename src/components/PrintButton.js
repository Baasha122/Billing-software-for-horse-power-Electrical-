'use client'

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="btn" 
      style={{ backgroundColor: '#10b981', color: 'white' }}
    >
      Print Invoice
    </button>
  )
}
