import { prisma } from '@/lib/prisma'
import InvoiceForm from '@/components/InvoiceForm'

export default async function NewInvoicePage() {
  const customers = await prisma.customer.findMany({ orderBy: { name: 'asc' } })

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Create Tax Invoice</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Generate a new GST tax invoice.
          </p>
        </div>
        <a href="/invoices" className="btn btn-secondary">Back to Invoices</a>
      </div>

      <InvoiceForm customers={customers} />
    </div>
  )
}
