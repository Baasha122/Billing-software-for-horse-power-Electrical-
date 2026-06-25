import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PrintButton from '@/components/PrintButton'

function numberToWords(num) {
  const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

  if ((num = num.toString()).length > 9) return 'overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return ''; let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
  return str.trim() ? str + 'Only' : '';
}

export default async function PrintInvoicePage(props) {
  const params = await props.params;
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { customer: true, items: true }
  })

  if (!invoice) notFound()

  const { customer, items } = invoice

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', backgroundColor: 'white', color: 'black', fontFamily: 'Arial, sans-serif', padding: '20px', fontSize: '11px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; margin: 0; }
          .sidebar, .top-nav { display: none !important; }
          .main-content { padding: 0 !important; overflow: visible !important; width: 100% !important; margin: 0 !important; }
          .no-print { display: none !important; }
          @page { margin: 0.5cm; }
        }
        .invoice-box { border: 1px solid black; }
        .grid-border { border: 1px solid black; }
        .border-bottom { border-bottom: 1px solid black; }
        .border-right { border-right: 1px solid black; }
        .border-top { border-top: 1px solid black; }
        .bold { font-weight: bold; }
        .p-2 { padding: 4px; }
        .p-4 { padding: 8px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 4px; }
        th { text-align: left; }
      `}} />

      <div className="no-print" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <a href="/invoices" className="btn" style={{ backgroundColor: 'var(--bg-tertiary)' }}>Back</a>
        <PrintButton />
      </div>

      <div className="invoice-box">
        {/* Top Header */}
        <div className="border-bottom p-2" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div className="bold" style={{ fontSize: '14px', letterSpacing: '1px' }}>TAX INVOICE</div>
          <div style={{ position: 'absolute', right: '8px', top: '4px', fontSize: '10px' }}>ORIGINAL FOR RECIPIENT</div>
        </div>

        {/* Company & Invoice Info */}
        <div style={{ display: 'flex' }} className="border-bottom">
          <div style={{ width: '50%' }} className="border-right p-4">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>

              <div>
                <div className="bold" style={{ fontSize: '16px' }}>HORSE POWER ELECTRICAL</div>
                <div style={{ marginTop: '4px' }}><span className="bold">GSTIN 33AARFH4498I1ZQ</span></div>
                <div>18/2 Sukaranthottam, Vivekananda Street,</div>
                <div>Udayampalayam, Chinnavedampatti (po),</div>
                <div>Coimbatore - 641 049</div>
                <div>Mobile: 9894301078</div>
              </div>
            </div>
          </div>
          <div style={{ width: '50%' }}>
            <div style={{ display: 'flex' }} className="border-bottom">
              <div style={{ width: '50%' }} className="border-right p-4">
                <div>S. No.</div>
                <div className="bold">{invoice.invoiceNumber}</div>
              </div>
              <div style={{ width: '50%' }} className="p-4">
                <div>Invoice Date:</div>
                <div className="bold">{new Date(invoice.createdAt).toLocaleDateString('en-GB')}</div>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '100%' }} className="p-4">
                <div>Place of Supply:</div>
                <div className="bold">{invoice.placeOfSupply || 'Tamil Nadu'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div style={{ display: 'flex' }} className="border-bottom">
          <div style={{ width: '50%' }} className="border-right p-4">
            <div>Customer Details:</div>
            <div className="bold">{customer.name}</div>
            <div style={{ marginTop: '4px' }}>Billing address:</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{customer.address}</div>
            {customer.gstin && <div>GSTIN: {customer.gstin}</div>}
            {customer.phone && <div>Ph: {customer.phone}</div>}
          </div>
          <div style={{ width: '50%' }} className="p-4">
            <div>Shipping address:</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{customer.address}</div>
          </div>
        </div>

        {/* Items Table */}
        <table style={{ borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}>
          <thead>
            <tr>
              <th style={{ borderTop: 'none', borderLeft: 'none', width: '6%', textAlign: 'center' }}>S. No.</th>
              <th style={{ borderTop: 'none', width: '35%', textAlign: 'center' }}>Item</th>
              <th style={{ borderTop: 'none', width: '10%', textAlign: 'center' }}>HSN/SAC</th>
              <th style={{ borderTop: 'none', width: '10%', textAlign: 'center' }}>Rate/Item</th>
              <th style={{ borderTop: 'none', width: '7%', textAlign: 'center' }}>Qty</th>
              <th style={{ borderTop: 'none', width: '10%', textAlign: 'center' }}>Taxable Value</th>
              <th style={{ borderTop: 'none', width: '12%', textAlign: 'center' }}>Tax Amount</th>
              <th style={{ borderTop: 'none', borderRight: 'none', width: '13%', textAlign: 'center' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              // Calculate item tax based on global invoice rates (approximate for item row)
              const totalTaxRate = (invoice.cgstRate || 0) + (invoice.sgstRate || 0) + (invoice.igstRate || 0);
              const itemTaxAmount = (item.amount * totalTaxRate) / 100;
              const itemTotal = item.amount + itemTaxAmount;

              return (
                <tr key={item.id} style={{ height: '30px' }}>
                  <td style={{ borderLeft: 'none', borderBottom: 'none', textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ borderBottom: 'none', textAlign: 'center' }}>
                    <div className="bold">{item.description}</div>
                  </td>
                  <td style={{ borderBottom: 'none', textAlign: 'center' }}>{item.hsnCode}</td>
                  <td style={{ borderBottom: 'none', textAlign: 'center' }}>{item.rate.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  <td style={{ borderBottom: 'none', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ borderBottom: 'none', textAlign: 'center' }}>{item.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  <td style={{ borderBottom: 'none', textAlign: 'center' }}>
                    {totalTaxRate > 0 ? (
                      <>
                        {itemTaxAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}<br/>
                        <span style={{ fontSize: '9px' }}>({totalTaxRate}%)</span>
                      </>
                    ) : '-'}
                  </td>
                  <td style={{ borderRight: 'none', borderBottom: 'none', textAlign: 'center' }}>{itemTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                </tr>
              )
            })}
            {/* Empty Rows */}
            {Array.from({ length: Math.max(0, 10 - items.length) }).map((_, i) => (
              <tr key={'empty'+i} style={{ height: '25px' }}>
                <td style={{ borderLeft: 'none', borderBottom: 'none', borderTop: 'none' }}></td>
                <td style={{ borderBottom: 'none', borderTop: 'none' }}></td>
                <td style={{ borderBottom: 'none', borderTop: 'none' }}></td>
                <td style={{ borderBottom: 'none', borderTop: 'none' }}></td>
                <td style={{ borderBottom: 'none', borderTop: 'none' }}></td>
                <td style={{ borderBottom: 'none', borderTop: 'none' }}></td>
                <td style={{ borderBottom: 'none', borderTop: 'none' }}></td>
                <td style={{ borderRight: 'none', borderBottom: 'none', borderTop: 'none' }}></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Row under table */}
        <div style={{ display: 'flex' }} className="border-top border-bottom">
          <div style={{ width: '58%', padding: '4px 8px' }}>
            Total Items / Qty: {items.length} / {items.reduce((sum, i) => sum + i.quantity, 0).toFixed(2)}
          </div>
          <div style={{ width: '42%' }}>
            <div style={{ display: 'flex' }} className="border-bottom">
              <div style={{ width: '60%', padding: '4px', textAlign: 'right' }}>Taxable Amount</div>
              <div style={{ width: '40%', padding: '4px', textAlign: 'right', borderLeft: '1px solid black' }} className="bold">
                ₹ {invoice.taxableValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}
              </div>
            </div>
            
            {invoice.igstRate > 0 ? (
              <div style={{ display: 'flex' }} className="border-bottom">
                <div style={{ width: '60%', padding: '4px', textAlign: 'right' }}>IGST {invoice.igstRate}%</div>
                <div style={{ width: '40%', padding: '4px', textAlign: 'right', borderLeft: '1px solid black' }}>
                  ₹ {invoice.igstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                </div>
              </div>
            ) : (
              <>
                {invoice.cgstRate > 0 && (
                  <div style={{ display: 'flex' }} className="border-bottom">
                    <div style={{ width: '60%', padding: '4px', textAlign: 'right' }}>CGST {invoice.cgstRate}%</div>
                    <div style={{ width: '40%', padding: '4px', textAlign: 'right', borderLeft: '1px solid black' }}>
                      ₹ {invoice.cgstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </div>
                  </div>
                )}
                {invoice.sgstRate > 0 && (
                  <div style={{ display: 'flex' }} className="border-bottom">
                    <div style={{ width: '60%', padding: '4px', textAlign: 'right' }}>SGST {invoice.sgstRate}%</div>
                    <div style={{ width: '40%', padding: '4px', textAlign: 'right', borderLeft: '1px solid black' }}>
                      ₹ {invoice.sgstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </div>
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'flex' }}>
              <div style={{ width: '60%', padding: '4px', textAlign: 'right', fontSize: '14px' }} className="bold">Total</div>
              <div style={{ width: '40%', padding: '4px', textAlign: 'right', borderLeft: '1px solid black', fontSize: '14px' }} className="bold">
                ₹ {invoice.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
              </div>
            </div>
          </div>
        </div>

        <div className="border-bottom p-2" style={{ textAlign: 'right' }}>
          Total amount (in words): INR {numberToWords(Math.round(invoice.totalAmount))}
        </div>
        <div className="border-bottom p-2" style={{ textAlign: 'right' }}>
          Amount Payable: <span className="bold">₹ {invoice.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
        </div>

        {/* Footer info grid */}
        <div style={{ display: 'flex', minHeight: '120px' }}>
          {/* Bank Details */}
          <div style={{ width: '50%' }} className="border-right p-4">
            <div className="bold" style={{ marginBottom: '5px' }}>Bank Details:</div>
            <table style={{ border: 'none', width: 'auto' }}>
              <tbody>
                <tr>
                  <td style={{ border: 'none', padding: '2px 10px 2px 0' }}>Bank:</td>
                  <td style={{ border: 'none', padding: '2px 0' }} className="bold">CITY UNION BANK</td>
                </tr>
                <tr>
                  <td style={{ border: 'none', padding: '2px 10px 2px 0' }}>Account #:</td>
                  <td style={{ border: 'none', padding: '2px 0' }} className="bold">510909010325465</td>
                </tr>
                <tr>
                  <td style={{ border: 'none', padding: '2px 10px 2px 0' }}>IFSC:</td>
                  <td style={{ border: 'none', padding: '2px 0' }}>CIUB0000487</td>
                </tr>
                <tr>
                  <td style={{ border: 'none', padding: '2px 10px 2px 0' }}>Branch:</td>
                  <td style={{ border: 'none', padding: '2px 0' }}>Coimbatore</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Signature */}
          <div style={{ width: '50%', position: 'relative' }} className="p-4">
            <div style={{ textAlign: 'right', fontSize: '10px', color: '#555' }}>For HORSE POWER ELECTRICAL</div>
            <div style={{ position: 'absolute', bottom: '10px', right: '15px', textAlign: 'center' }}>
              <div style={{ marginTop: '40px', borderTop: '1px solid black', width: '150px', paddingTop: '5px' }}>
                Authorised Signatory
              </div>
            </div>
          </div>
        </div>



      </div>
    </div>
  )
}
