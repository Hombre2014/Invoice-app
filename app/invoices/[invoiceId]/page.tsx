import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/db';
import Invoice from './Invoice';
import { Customers, Invoices } from '@/db/schema';

export default async function InvoicePage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const { userId } = auth();
  // const invoiceId = parseInt(params.invoiceId);

  // if (!userId) return;

  // if (isNaN(invoiceId)) {
  //   throw new Error('Invalid invoice ID');
  // }

  if (!userId) return;

  const invoiceId = Number.parseInt(params.invoiceId);

  if (Number.isNaN(invoiceId)) {
    throw new Error('Invalid Invoice ID');
  }

  // const [result] = await db
  //   .select()
  //   .from(Invoices)
  //   .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
  //   .where(and(eq(Invoices.userId, userId), eq(Invoices.id, invoiceId)))
  //   .limit(1);

  const [result]: Array<{
    invoices: typeof Invoices.$inferSelect;
    customers: typeof Customers.$inferSelect;
  }> = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .limit(1);

  if (!result) {
    return notFound();
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  };

  return <Invoice invoice={invoice} />;
}
