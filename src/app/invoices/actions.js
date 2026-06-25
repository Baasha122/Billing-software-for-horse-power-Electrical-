'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createInvoice(data) {
  let { 
    invoiceNumber, customerName, customerAddress, customerGstin, customerPhone,
    poNumber, transportMode, vehicleNo, placeOfSupply,
    items, taxableValue, cgstRate, sgstRate, igstRate,
    cgstAmount, sgstAmount, igstAmount, totalAmount 
  } = data

  if (!invoiceNumber || invoiceNumber.trim() === '') {
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    let nextNum = 42; // Starting number as requested
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const parts = lastInvoice.invoiceNumber.split('-');
      const lastPart = parts[parts.length - 1];
      if (!isNaN(lastPart)) {
        const lastNum = parseInt(lastPart, 10);
        nextNum = Math.max(lastNum + 1, 42);
      }
    }
    
    invoiceNumber = `INV-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`;
  }

  let customer = await prisma.customer.findFirst({ where: { name: customerName } })
  if (!customer) {
    customer = await prisma.customer.create({
      data: { name: customerName, address: customerAddress, gstin: customerGstin, phone: customerPhone }
    })
  } else {
    customer = await prisma.customer.update({
      where: { id: customer.id },
      data: { 
        address: customerAddress || customer.address, 
        gstin: customerGstin || customer.gstin, 
        phone: customerPhone || customer.phone 
      }
    })
  }

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      customerId: customer.id,
      poNumber,
      transportMode,
      vehicleNo,
      placeOfSupply,
      taxableValue,
      cgstRate,
      sgstRate,
      igstRate,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalAmount,
      status: 'PENDING',
      items: {
        create: items.map(item => ({
          description: item.description,
          hsnCode: item.hsnCode,
          quantity: parseInt(item.quantity),
          rate: parseFloat(item.rate),
          amount: parseFloat(item.amount)
        }))
      }
    }
  })

  revalidatePath('/invoices')
  redirect(`/invoices/${invoice.id}/print`)
}

export async function markAsPaid(invoiceId) {
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: 'COMPLETED' }
  })
  revalidatePath('/invoices')
}
