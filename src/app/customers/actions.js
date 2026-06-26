'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addCustomer(formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const address = formData.get('address')
  const gstin = formData.get('gstin')

  await prisma.customer.create({
    data: { name, email, phone, address, gstin },
  })

  revalidatePath('/customers')
}

export async function deleteCustomer(id) {
  await prisma.customer.delete({
    where: { id }
  })
  revalidatePath('/customers')
}
