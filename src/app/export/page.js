'use client'

import { useState, useEffect } from 'react';
import { getInvoicesForExport } from './actions';

export default function ExportDashboard() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    async function loadInvoices() {
      setLoading(true);
      try {
        const data = await getInvoicesForExport(month, year);
        setInvoices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();
  }, [month, year]);

  const handleDownload = () => {
    window.location.href = `/api/export?month=${month}&year=${year}`;
  };

  return (
    <div className="dashboard-container">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Export Reports</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: '1.1rem' }}>
            Select a month and year to download the Excel report for that period.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Filter Criteria</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', maxWidth: '600px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Month</label>
            <select 
              className="input-field" 
              value={month} 
              onChange={(e) => setMonth(parseInt(e.target.value))}
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Year</label>
            <select 
              className="input-field" 
              value={year} 
              onChange={(e) => setYear(parseInt(e.target.value))}
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={handleDownload} className="btn" style={{ maxWidth: '600px', width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '0.75rem' }}>
          Download Excel Report
        </button>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>
          Invoices for {months.find(m => m.value === month)?.label} {year}
        </h2>
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", border: "1px dashed var(--border-color)", borderRadius: "8px" }}>
            <p style={{ color: "var(--text-secondary)" }}>No invoices found for this period.</p>
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
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background-color 0.2s ease" }}>
                    <td style={{ padding: "1rem 0", fontWeight: 'bold' }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: "1rem 0", fontWeight: 500 }}>{inv.customer?.name}</td>
                    <td style={{ padding: "1rem 0", color: "var(--text-secondary)" }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "1rem 0", fontWeight: "bold" }}>₹{inv.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
