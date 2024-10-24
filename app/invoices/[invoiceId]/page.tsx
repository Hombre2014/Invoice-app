import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/db';
import Invoice from './Invoice';
import { Invoices } from '@/db/schema';

export default async function InvoicePage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const { userId } = auth();
  const invoiceId = parseInt(params.invoiceId);

  if (!userId) {
    return;
  }

  if (isNaN(invoiceId)) {
    throw new Error('Invalid invoice ID');
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.userId, userId), eq(Invoices.id, invoiceId)))
    .limit(1);

  if (!result) {
    return notFound();
  }

  return <Invoice invoice={result} />;
}
