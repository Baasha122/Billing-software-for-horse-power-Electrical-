import { prisma } from '@/lib/prisma'
import { markAsPaid } from './actions'

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem" }}>Invoices</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Manage and view all your billing records.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/export" className="btn" style={{ backgroundColor: '#10b981', textDecoration: 'none' }}>Export Excel</a>
          <a href="/invoices/new" className="btn" style={{ textDecoration: 'none' }}>+ New Invoice</a>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Recent Invoices</h2>
        {invoices.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", border: "1px dashed var(--border-color)", borderRadius: "8px" }}>
            <p style={{ color: "var(--text-secondary)" }}>No invoices found. Create your first invoice above.</p>
          </div>
        ) : (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                  <th style={{ padding: "1rem 0", fontWeight: 500 }}>S. No.</th>
                  <th style={{ padding: "1rem 0", fontWeight: 500 }}>Customer</th>
                  <th style={{ padding: "1rem 0", fontWeight: 500 }}>Date</th>
                  <th style={{ padding: "1rem 0", fontWeight: 500 }}>Total Amount</th>
                  <th style={{ padding: "1rem 0", fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background-color 0.2s ease" }}>
                    <td style={{ padding: "1rem 0", fontWeight: 'bold' }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: "1rem 0", fontWeight: 500 }}>{inv.customer?.name}</td>
                    <td style={{ padding: "1rem 0", color: "var(--text-secondary)" }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "1rem 0", fontWeight: "bold" }}>₹{inv.totalAmount.toFixed(2)}</td>
                    <td style={{ padding: "1rem 0", display: "flex", gap: "0.5rem" }}>
                      <a href={`/invoices/${inv.id}/print`} className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", textDecoration: "none" }}>Print</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
