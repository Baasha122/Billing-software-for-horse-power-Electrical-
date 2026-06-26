'use client'

import { useState, useMemo } from 'react'
import { createInvoice } from '@/app/invoices/actions'

export default function InvoiceForm({ customers }) {
  const [customerName, setCustomerName] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [customerGstin, setCustomerGstin] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [poNumber, setPoNumber] = useState('')
  const [transportMode, setTransportMode] = useState('')
  const [vehicleNo, setVehicleNo] = useState('')
  const [placeOfSupply, setPlaceOfSupply] = useState('')
  
  const [items, setItems] = useState([
    { id: Date.now(), description: '', hsnCode: '', quantity: 1, rate: 0 }
  ])
  
  const [gstType, setGstType] = useState('IGST') // IGST or CGST_SGST
  const [gstPercentage, setGstPercentage] = useState(18)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', hsnCode: '', quantity: 1, rate: 0 }])
  }

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  // Handle autocomplete from known customers
  const handleCustomerNameChange = (e) => {
    const val = e.target.value;
    setCustomerName(val);
    const existing = customers.find(c => c.name.toLowerCase() === val.toLowerCase());
    if (existing) {
      setCustomerAddress(existing.address || '');
      setCustomerGstin(existing.gstin || '');
      setCustomerPhone(existing.phone || '');
    }
  }

  const itemsWithAmount = useMemo(() => {
    return items.map(item => ({
      ...item,
      amount: item.quantity * item.rate
    }))
  }, [items])

  const taxableValue = useMemo(() => {
    return itemsWithAmount.reduce((sum, item) => sum + item.amount, 0)
  }, [itemsWithAmount])

  const taxCalculation = useMemo(() => {
    let cgstRate = 0, sgstRate = 0, igstRate = 0
    let cgstAmount = 0, sgstAmount = 0, igstAmount = 0

    if (gstType === 'IGST') {
      igstRate = gstPercentage
      igstAmount = taxableValue * (igstRate / 100)
    } else {
      cgstRate = gstPercentage / 2
      sgstRate = gstPercentage / 2
      cgstAmount = taxableValue * (cgstRate / 100)
      sgstAmount = taxableValue * (sgstRate / 100)
    }

    const rawTotal = taxableValue + cgstAmount + sgstAmount + igstAmount
    const roundedTotal = Math.round(rawTotal)
    const roundOff = roundedTotal - rawTotal

    return { cgstRate, sgstRate, igstRate, cgstAmount, sgstAmount, igstAmount, roundedTotal, roundOff }
  }, [taxableValue, gstType, gstPercentage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!customerName) return alert('Please enter a customer name (To:)')
    if (items.some(i => !i.description || i.quantity <= 0)) return alert('Please complete all line items')

    setIsSubmitting(true)
    try {
      await createInvoice({
        invoiceNumber,
        customerName,
        customerAddress,
        customerGstin,
        customerPhone,
        poNumber,
        transportMode,
        vehicleNo,
        placeOfSupply,
        items: itemsWithAmount,
        taxableValue,
        cgstRate: taxCalculation.cgstRate,
        sgstRate: taxCalculation.sgstRate,
        igstRate: taxCalculation.igstRate,
        cgstAmount: taxCalculation.cgstAmount,
        sgstAmount: taxCalculation.sgstAmount,
        igstAmount: taxCalculation.igstAmount,
        totalAmount: taxCalculation.roundedTotal
      })
    } catch (error) {
      setIsSubmitting(false)
      if (error.message && error.message.includes('NEXT_REDIRECT')) {
        throw error
      }
      console.error(error)
      alert("Failed to save invoice: " + error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} autoComplete="off">
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: "1rem" }}>To (Customer Details)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input type="text" className="input-field" placeholder="Customer Name *" value={customerName} onChange={handleCustomerNameChange} required list="customer-list" autoComplete="off" />
            <datalist id="customer-list">
              {customers.map(c => <option key={c.id} value={c.name} />)}
            </datalist>
            
            <textarea className="input-field" placeholder="Full Address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows="3" style={{ resize: 'vertical' }}></textarea>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input type="text" className="input-field" placeholder="GSTIN" value={customerGstin} onChange={(e) => setCustomerGstin(e.target.value)} />
              <input type="text" className="input-field" placeholder="Phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            </div>
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: "1rem" }}>Invoice Details <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal'}}>(All fields are optional)</span></h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>S. No. (Auto-generates if blank)</label>
              <input type="text" className="input-field" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>P.O No & Date</label>
              <input type="text" className="input-field" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Transport Mode</label>
              <input type="text" className="input-field" value={transportMode} onChange={(e) => setTransportMode(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Vehicle No</label>
              <input type="text" className="input-field" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Place of supply</label>
              <input type="text" className="input-field" value={placeOfSupply} onChange={(e) => setPlaceOfSupply(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "1rem" }}>Description of Goods</h3>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: 'var(--text-secondary)' }}>
                <th style={{ padding: "0.5rem" }}>Description</th>
                <th style={{ padding: "0.5rem", width: '120px' }}>HSN Code</th>
                <th style={{ padding: "0.5rem", width: '100px' }}>Qty</th>
                <th style={{ padding: "0.5rem", width: '120px' }}>Rate</th>
                <th style={{ padding: "0.5rem", width: '120px' }}>Amount</th>
                <th style={{ padding: "0.5rem", width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {itemsWithAmount.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "0.5rem" }}>
                    <input type="text" className="input-field" placeholder="Item Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required />
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    <input type="text" className="input-field" placeholder="HSN" value={item.hsnCode} onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)} />
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    <input type="number" className="input-field" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value === '' ? '' : parseInt(e.target.value))} required />
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    <input type="number" step="0.01" className="input-field" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value === '' ? '' : parseFloat(e.target.value))} required />
                  </td>
                  <td style={{ padding: "0.5rem", fontWeight: 'bold' }}>
                    {item.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    <button type="button" onClick={() => removeItem(index)} className="btn btn-secondary" style={{ padding: '0.4rem', backgroundColor: 'var(--danger)', color: 'white', border: 'none', borderRadius: '6px' }}>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addItem} className="btn" style={{ marginTop: '1rem' }}>+ Add Row</button>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: "1rem" }}>Tax Settings</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select className="input-field" value={gstType} onChange={(e) => setGstType(e.target.value)} style={{ width: '150px', backgroundColor: 'var(--bg-primary)' }}>
              <option value="IGST">IGST</option>
              <option value="CGST_SGST">CGST + SGST</option>
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="number" className="input-field" value={gstPercentage} onChange={(e) => setGstPercentage(parseFloat(e.target.value) || 0)} style={{ width: '80px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>% GST</span>
            </div>
          </div>
        </div>
        
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>TAXABLE VALUE</span>
            <span style={{ fontWeight: 500 }}>{taxableValue.toFixed(2)}</span>
          </div>
          {gstType === 'CGST_SGST' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>CGST @ {taxCalculation.cgstRate}%</span>
                <span style={{ fontWeight: 500 }}>{taxCalculation.cgstAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>SGST @ {taxCalculation.sgstRate}%</span>
                <span style={{ fontWeight: 500 }}>{taxCalculation.sgstAmount.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>IGST @ {taxCalculation.igstRate}%</span>
              <span style={{ fontWeight: 500 }}>{taxCalculation.igstAmount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            <span>Rounded off (+/-)</span>
            <span>{taxCalculation.roundOff.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
            <span>INVOICE TOTAL</span>
            <span style={{ color: 'var(--accent-primary)' }}>{taxCalculation.roundedTotal.toFixed(2)}</span>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn" style={{ width: '100%', marginTop: '1.5rem', height: '50px', fontSize: '1.1rem', justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Saving Invoice...' : 'Save & Print Invoice'}
          </button>
        </div>
      </div>
    </form>
  )
}
