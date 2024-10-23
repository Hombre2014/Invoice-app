'use server';

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/db';
import { Invoices } from '@/db/schema';

export async function createInvoice(formData: FormData) {
  const { userId } = auth();
  const value = Math.floor(parseFloat(String(formData.get('value'))) * 100);
  const description = formData.get('description') as string;

  if (!userId) {
    return;
  }

  const results = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      status: 'open',
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${results[0].id}`);
}
