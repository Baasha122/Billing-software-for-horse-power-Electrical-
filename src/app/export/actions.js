'use server'
import { prisma } from '@/lib/prisma'

export async function getInvoicesForExport(month, year) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const invoices = await prisma.invoice.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate
      }
    },
    include: { customer: true },
    orderBy: { createdAt: 'desc' }
  });

  return invoices;
}
