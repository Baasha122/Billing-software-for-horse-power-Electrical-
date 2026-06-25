import { prisma } from '@/lib/prisma'
import { addCustomer } from './actions'

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Customers</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Manage your client base and their contact information.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>Add New Customer</h2>
          <form action={addCustomer} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 200px' }}>
              <input type="text" name="name" placeholder="Full Name *" required className="input-field" />
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <input type="text" name="phone" placeholder="Phone Number" className="input-field" />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <input type="text" name="gstin" placeholder="GSTIN (Optional)" className="input-field" />
            </div>
            <div style={{ flex: '2 1 300px' }}>
              <input type="text" name="address" placeholder="Physical Address" className="input-field" />
            </div>
            <button type="submit" className="btn" style={{ height: "46px" }}>Add Customer</button>
          </form>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Customer List</h2>
        {customers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", border: "1px dashed var(--border-color)", borderRadius: "8px" }}>
            <p style={{ color: "var(--text-secondary)" }}>No customers found. Add your first customer above.</p>
          </div>
        ) : (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                  <th style={{ padding: "1rem 0", fontWeight: 500 }}>Name</th>
                  <th style={{ padding: "1rem 0", fontWeight: 500 }}>Contact Info</th>
                  <th style={{ padding: "1rem 0", fontWeight: 500 }}>Address</th>
                  <th style={{ padding: "1rem 0", fontWeight: 500 }}>Added On</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background-color 0.2s ease" }}>
                    <td style={{ padding: "1rem 0", fontWeight: 500 }}>{customer.name}</td>
                    <td style={{ padding: "1rem 0" }}>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                        {customer.phone && <div>{customer.phone}</div>}
                        {!customer.phone && '-'}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 0", color: "var(--text-secondary)" }}>{customer.address || '-'}</td>
                    <td style={{ padding: "1rem 0", color: "var(--text-secondary)" }}>{new Date(customer.createdAt).toLocaleDateString()}</td>
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
