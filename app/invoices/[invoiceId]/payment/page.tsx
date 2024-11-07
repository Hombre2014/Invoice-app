import Stripe from 'stripe';
import { eq, is } from 'drizzle-orm';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { db } from '@/db';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Check, CreditCard } from 'lucide-react';
import { Customers, Invoices } from '@/db/schema';
import { createPayment, updateStatusAction } from '@/app/actions';

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

// Original code from the video course:
// interface PaymentPageProps {
//   params: { invoiceId: string };
//   searchParams: { status: string };
// }

export default async function PaymentPage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const invoiceId = parseInt(params.invoiceId);

  async function getHeaderList() {
    try {
      const headerList = await headers();
      const entries = Array.from(headerList.entries());
      const specificHeader = entries[entries.length - 2]; // Get the element with index 25
      const url = specificHeader[1]; // Get the second element (URL)
      // Trim the first 66 characters from the session_id FIRST 66 CHARACTERS!!!

      const session_id = url.split('session_id=')[1].substring(0, 66);

      // Create a URL object
      const parsedUrl = new URL(url);
      // Get the value of the 'status' parameter
      const status = parsedUrl.searchParams.get('status');

      return {
        status,
        session_id,
      }; // Now you can return or use the status as needed
    } catch (error) {
      console.error('Error fetching headers:', error);
      return null; // Handle error case
    }
  }

  const { status, session_id } = (await getHeaderList()) || {};
  const isCanceled = session_id && status === 'canceled';
  const isSuccess = status === 'success';
  let isError = isSuccess && !session_id;

  if (isNaN(invoiceId)) {
    throw new Error('Invalid invoice ID');
  }

  if (isSuccess && session_id) {
    const { payment_status } = await stripe.checkout.sessions.retrieve(
      session_id!
    );
    if (payment_status !== 'paid') {
      isError = true;
    } else {
      const formData = new FormData();
      formData.append('id', String(invoiceId));
      formData.append('status', 'paid');
      await updateStatusAction(formData);
    }
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
        {isError && (
          <div className="bg-red-100 text-red-800 rounded-lg p-4 mx-auto my-8">
            <p>
              There was an error processing your payment. Please, try again.
            </p>
          </div>
        )}
        {isCanceled && (
          <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 mx-auto my-8">
            <p>Payment was canceled. Please, try again.</p>
          </div>
        )}
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
              <form action={createPayment}>
                <input type="hidden" name="id" value={invoice.id} />
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
