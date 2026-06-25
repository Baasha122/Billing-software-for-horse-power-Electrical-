import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let whereClause = {}
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999)
      whereClause = {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: { customer: true },
      orderBy: { createdAt: 'desc' }
    })

    const data = invoices.map(inv => ({
      'Date': new Date(inv.createdAt).toLocaleDateString('en-IN'),
      'Invoice No': inv.invoiceNumber,
      'Customer Name': inv.customer.name,
      'GSTIN': inv.customer.gstin || '',
      'Place of Supply': inv.placeOfSupply || '',
      'Taxable Value': inv.taxableValue,
      'CGST Amount': inv.cgstAmount,
      'SGST Amount': inv.sgstAmount,
      'IGST Amount': inv.igstAmount,
      'Total Amount': inv.totalAmount,
      'Status': inv.status
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices')

    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="Invoices_Export_${new Date().toISOString().split('T')[0]}.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
  } catch (error) {
    console.error('Error exporting excel:', error)
    return new NextResponse('Error generating excel', { status: 500 })
  }
}
