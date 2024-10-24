'use server';

import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { Invoices, Status } from '@/db/schema';

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

export async function updateStatusAction(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const id = formData.get('id') as string;
  const status = formData.get('status') as Status;

  const results = await db
    .update(Invoices)
    .set({ status })
    .where(and(eq(Invoices.userId, userId), eq(Invoices.id, parseInt(id))));

  revalidatePath(`/invoices/${id}`), 'page';
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const id = formData.get('id') as string;

  await db
    .delete(Invoices)
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

  redirect('/dashboard');
}
