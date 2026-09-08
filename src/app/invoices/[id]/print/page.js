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
    <div className="print-container" style={{ maxWidth: '850px', margin: '0 auto', backgroundColor: 'white', color: 'black', fontFamily: 'Arial, sans-serif', padding: '20px', fontSize: '11px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body, html, .app-container { 
            background: white; 
            margin: 0; 
            height: auto !important; 
            min-height: auto !important; 
            overflow: visible !important; 
            display: block !important; 
          }
          .sidebar, .top-nav { display: none !important; }
          .main-content { padding: 0 !important; overflow: visible !important; width: 100% !important; margin: 0 !important; height: auto !important; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0.5cm; }
          .invoice-box { min-height: 275mm !important; height: 275mm !important; }
          .invoice-page { break-after: page; page-break-after: always; margin-bottom: 0 !important; }
          .print-container { padding: 0 !important; }
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

      <div className="no-print" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start', gap: '15px' }}>
        <a href="/invoices" className="btn" style={{ backgroundColor: 'var(--bg-tertiary)' }}>Back</a>
        <PrintButton />
      </div>

      <div className="invoice-page">
        <div className="invoice-box" style={{ display: 'flex', flexDirection: 'column', minHeight: '1050px' }}>
          {/* Top Header */}
          <div className="border-bottom" style={{ padding: '10px', textAlign: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '10px', top: '10px', fontSize: '10px' }}>2qGSTIN: 33AARFH4498J1ZQ</div>
            <div style={{ fontSize: '14px', letterSpacing: '1px' }}>TAX INVOICE</div>
            <div style={{ fontSize: '20px', margin: '5px 0' }}>HORSE POWER ELECTRICAL</div>
            <div style={{ fontSize: '12px' }}>Mfrs.: Motors &amp; Pumps</div>
            <div style={{ fontSize: '11px' }}>18/2 Sukaranthottam, Vivekananda Street, Udayampalayam, Chinnavedampatti (po), Coimbatore -641 049</div>
          </div>

          {/* Customer & Invoice Info */}
          <div style={{ display: 'flex' }} className="border-bottom">
            {/* Left Column - To */}
            <div style={{ width: '50%' }} className="border-right p-2">
              <div>To: {customer.name}</div>
              <div style={{ whiteSpace: 'pre-wrap', marginLeft: '20px' }}>{customer.address}</div>
              {customer.gstin && <div style={{ marginLeft: '20px' }}>GSTIN {customer.gstin}</div>}
              {customer.phone && <div style={{ marginLeft: '20px' }}>PHN {customer.phone}</div>}
            </div>
            
            {/* Right Column - Details */}
            <div style={{ width: '50%' }}>
              <div style={{ display: 'flex', padding: '4px' }} className="border-bottom">
                <div style={{ width: '50%' }}>S. No: {invoice.invoiceNumber}</div>
                <div style={{ width: '50%' }}>DATE {new Date(invoice.createdAt).toLocaleDateString('en-GB').replace(/\//g, '.')}</div>
              </div>
              <div className="p-2">
                <table style={{ border: 'none', width: '100%', padding: 0 }}>
                  <tbody>
                    <tr><td style={{ border: 'none', padding: '2px 0', width: '40%' }}>P.O No &amp; Date</td><td style={{ border: 'none', padding: '2px 0' }}>:</td></tr>
                    <tr><td style={{ border: 'none', padding: '2px 0' }}>Transport Mode</td><td style={{ border: 'none', padding: '2px 0' }}>:</td></tr>
                    <tr><td style={{ border: 'none', padding: '2px 0' }}>Vehicle No</td><td style={{ border: 'none', padding: '2px 0' }}>:</td></tr>
                    <tr><td style={{ border: 'none', padding: '2px 0' }}>Place of supply</td><td style={{ border: 'none', padding: '2px 0' }}>: {invoice.placeOfSupply}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <table style={{ borderLeft: 'none', borderRight: 'none', borderBottom: 'none', height: '100%' }}>
              <thead>
                <tr>
                  <th rowSpan="2" style={{ borderTop: 'none', borderLeft: 'none', width: '5%', textAlign: 'center' }}>S<br/>no</th>
                  <th rowSpan="2" style={{ borderTop: 'none', width: '45%', textAlign: 'center' }}>Description of Goods</th>
                  <th rowSpan="2" style={{ borderTop: 'none', width: '10%', textAlign: 'center' }}>HSN<br/>Code</th>
                  <th rowSpan="2" style={{ borderTop: 'none', width: '8%', textAlign: 'center' }}>Quantity</th>
                  <th colSpan="2" style={{ borderTop: 'none', width: '16%', textAlign: 'center', borderBottom: '1px solid black' }}>Rate</th>
                  <th colSpan="2" style={{ borderTop: 'none', borderRight: 'none', width: '16%', textAlign: 'center', borderBottom: '1px solid black' }}>Amount</th>
                </tr>
                <tr>
                  <th style={{ textAlign: 'center', borderTop: 'none' }}>Rs</th>
                  <th style={{ textAlign: 'center', borderTop: 'none' }}>ps.</th>
                  <th style={{ textAlign: 'center', borderTop: 'none' }}>Rs</th>
                  <th style={{ borderRight: 'none', textAlign: 'center', borderTop: 'none' }}>ps.</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const rateSplit = item.rate.toFixed(2).split('.');
                  const amountSplit = item.amount.toFixed(2).split('.');
                  return (
                    <tr key={item.id} style={{ height: '30px' }}>
                      <td style={{ borderLeft: 'none', borderBottom: 'none', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ borderBottom: 'none' }}>
                        <div style={{ paddingLeft: '5px' }}>{item.description}</div>
                      </td>
                      <td style={{ borderBottom: 'none', textAlign: 'center' }}>{item.hsnCode}</td>
                      <td style={{ borderBottom: 'none', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ borderBottom: 'none', textAlign: 'right' }}>{rateSplit[0]}</td>
                      <td style={{ borderBottom: 'none', textAlign: 'center' }}>{rateSplit[1]}</td>
                      <td style={{ borderBottom: 'none', textAlign: 'right' }}>{amountSplit[0]}</td>
                      <td style={{ borderRight: 'none', borderBottom: 'none', textAlign: 'center' }}>{amountSplit[1]}</td>
                    </tr>
                  )
                })}
                {/* Empty Row that stretches to fill remaining space */}
                <tr style={{ height: '100%' }}>
                  <td style={{ borderLeft: 'none', borderBottom: 'none', borderTop: 'none' }}></td>
                  <td style={{ borderBottom: 'none', borderTop: 'none' }}></td>
                  <td style={{ borderBottom: 'none', borderTop: 'none' }}></td>
                  <td style={{ borderBottom: 'none', borderTop: 'none' }}></td>
                  <td style={{ borderBottom: 'none', borderTop: 'none' }}></td>
                  <td style={{ borderBottom: 'none', borderTop: 'none' }}></td>
                  <td style={{ borderBottom: 'none', borderTop: 'none' }}></td>
                  <td style={{ borderRight: 'none', borderBottom: 'none', borderTop: 'none' }}></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Area */}
          <div style={{ display: 'flex', borderTop: '1px solid black' }}>
            {/* Left Footer: Words, Bank, Sign */}
            <div style={{ width: '60%', borderRight: '1px solid black', display: 'flex', flexDirection: 'column' }}>
              <div className="border-bottom p-2" style={{ minHeight: '40px' }}>
                Total Amount (in words) : {numberToWords(Math.round(invoice.totalAmount)).toUpperCase()}
              </div>
              
              <div className="border-bottom p-2" style={{ flexGrow: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '5px' }}>Bank Details</div>
                <table style={{ border: 'none', width: '100%' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: 'none', padding: '2px 0', width: '40%' }}>Name of the Bank</td>
                      <td style={{ border: 'none', padding: '2px 0' }}>: CITY UNION BANK</td>
                    </tr>
                    <tr>
                      <td style={{ border: 'none', padding: '2px 0' }}>Branch</td>
                      <td style={{ border: 'none', padding: '2px 0' }}>: Maniyakaranpalayam</td>
                    </tr>
                    <tr>
                      <td style={{ border: 'none', padding: '2px 0' }}>A/c</td>
                      <td style={{ border: 'none', padding: '2px 0' }}>: 510909010325465</td>
                    </tr>
                    <tr>
                      <td style={{ border: 'none', padding: '2px 0' }}>IFSC Code</td>
                      <td style={{ border: 'none', padding: '2px 0' }}>: CIUB0000487</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-bottom p-2">
                E-way Bill No :
              </div>

              <div className="p-2" style={{ position: 'relative', height: '60px' }}>
                <div style={{ fontSize: '10px' }}>Received the above in good condition</div>
                <div style={{ fontSize: '10px', marginTop: '5px' }}>Receiver's signature</div>
              </div>
            </div>

            {/* Right Footer: Totals */}
            <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
              <table style={{ border: 'none', width: '100%', height: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ borderLeft: 'none', borderTop: 'none', borderRight: '1px solid black', borderBottom: '1px solid black', padding: '4px 8px' }}>TAXABLE VALUE</td>
                    <td style={{ borderTop: 'none', borderRight: 'none', borderBottom: '1px solid black', padding: '4px 8px', textAlign: 'right' }}>{invoice.taxableValue.toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td style={{ borderLeft: 'none', borderTop: 'none', borderRight: '1px solid black', borderBottom: '1px solid black', padding: '4px 8px' }}>CGST @ {invoice.cgstRate || 9}</td>
                    <td style={{ borderTop: 'none', borderRight: 'none', borderBottom: '1px solid black', padding: '4px 8px', textAlign: 'right' }}>{invoice.cgstAmount ? invoice.cgstAmount.toFixed(0) : ''}</td>
                  </tr>
                  <tr>
                    <td style={{ borderLeft: 'none', borderTop: 'none', borderRight: '1px solid black', borderBottom: '1px solid black', padding: '4px 8px' }}>SGST @ {invoice.sgstRate || 9}</td>
                    <td style={{ borderTop: 'none', borderRight: 'none', borderBottom: '1px solid black', padding: '4px 8px', textAlign: 'right' }}>{invoice.sgstAmount ? invoice.sgstAmount.toFixed(0) : ''}</td>
                  </tr>
                  <tr>
                    <td style={{ borderLeft: 'none', borderTop: 'none', borderRight: '1px solid black', borderBottom: '1px solid black', padding: '4px 8px' }}>IGST @</td>
                    <td style={{ borderTop: 'none', borderRight: 'none', borderBottom: '1px solid black', padding: '4px 8px', textAlign: 'right' }}>{invoice.igstAmount ? invoice.igstAmount.toFixed(0) : ''}</td>
                  </tr>
                  <tr>
                    <td style={{ borderLeft: 'none', borderTop: 'none', borderRight: '1px solid black', borderBottom: '1px solid black', padding: '4px 8px' }}>Rounded off (+/-)</td>
                    <td style={{ borderTop: 'none', borderRight: 'none', borderBottom: '1px solid black', padding: '4px 8px', textAlign: 'right' }}></td>
                  </tr>
                  <tr>
                    <td style={{ borderLeft: 'none', borderTop: 'none', borderRight: '1px solid black', borderBottom: '1px solid black', padding: '4px 8px' }}>INVOICE TOTAL</td>
                    <td style={{ borderTop: 'none', borderRight: 'none', borderBottom: '1px solid black', padding: '4px 8px', textAlign: 'right' }}>{invoice.totalAmount.toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ border: 'none', padding: '4px', textAlign: 'center', height: '100px', verticalAlign: 'top', position: 'relative' }}>
                      <div style={{ fontSize: '11px', paddingTop: '5px' }}>for HORSE POWER ELECTRICAL</div>
                      <div style={{ position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center', fontSize: '10px', color: '#555' }}>
                        Authorised Signatory
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
