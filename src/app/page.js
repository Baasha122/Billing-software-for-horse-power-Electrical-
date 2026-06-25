import { prisma } from '@/lib/prisma'
import InvoiceForm from '@/components/InvoiceForm'

export default async function Dashboard() {
  const customers = await prisma.customer.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Billing Dashboard</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: '1.1rem' }}>
          Fill in the details below to generate a new invoice.
        </p>
      </div>
      
      <div className="invoice-section">
        <InvoiceForm customers={customers} />
      </div>
    </div>
  );
}
