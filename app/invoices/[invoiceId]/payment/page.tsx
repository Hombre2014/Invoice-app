import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { db } from '@/db';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Container from '@/components/Container';
import { Customers, Invoices } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { Check, CreditCard } from 'lucide-react';

export default async function PaymentPage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const invoiceId = parseInt(params.invoiceId);

  if (isNaN(invoiceId)) {
    throw new Error('Invalid invoice ID');
  }

  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      value: Invoices.value,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    return notFound();
  }

  const invoice = {
    ...result,
    customer: {
      name: result.name,
    },
  };

  return (
    <main className="w-full h-full">
      <Container>
        <div className="grid grid-cols-2">
          <div>
            <div className="flex justify-between mb-8">
              <h1 className="flex items-center gap-4 text-3xl font-semibold">
                Invoice {invoice.id}
                <Badge
                  className={cn(
                    'rounded-full capitalize',
                    invoice.status === 'open' && 'bg-blue-500',
                    invoice.status === 'paid' && 'bg-green-500',
                    invoice.status === 'void' && 'bg-gray-500',
                    invoice.status === 'uncollectible' && 'bg-red-500'
                  )}
                >
                  {invoice.status}
                </Badge>
              </h1>
            </div>

            <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>
            <p className="text-lg mb-8">{invoice.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Manage Invoice</h2>
            {invoice.status === 'open' && (
              <form action="">
                <Button className="flex gap-2 bg-green-700 font-bold">
                  <CreditCard className="w-5 h-auto" />
                  Pay invoice
                </Button>
              </form>
            )}
            {invoice.status === 'paid' && (
              <p className="font-bold flex gap-2 items-center">
                <Check className="w-6 h-auto bg-green-500 rounded-full text-white p-1" />
                Invoice paid.
              </p>
            )}
          </div>
        </div>

        <h2 className="font-bold text-lg bm-4">Billing Details</h2>

        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{invoice.id}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            <span>{invoice.customer.name}</span>
          </li>
          {/* <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Email
            </strong>
            <span>{invoice.customer.email}</span>
          </li> */}
        </ul>
      </Container>
    </main>
  );
}
