'use server';

import Stripe from 'stripe';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/db';
import { Customers, Invoices, Status } from '@/db/schema';

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

export async function createInvoice(formData: FormData) {
  const { userId } = auth();

  if (!userId) return;

  const value = Math.floor(parseFloat(String(formData.get('value'))) * 100);
  const description = formData.get('description') as string;
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;

  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
    })
    .returning({
      id: Customers.id,
    });

  const results = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      customerId: customer.id,
      status: 'open',
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
  const { userId } = auth();

  if (!userId) return;

  const id = formData.get('id') as string;
  const status = formData.get('status') as Status;

  const results = await db
    .update(Invoices)
    .set({ status })
    .where(and(eq(Invoices.userId, userId), eq(Invoices.id, parseInt(id))));

  if (!results) {
    throw new Error('Invalid Invoice id');
  }

  // revalidatePath(`/invoices/${id}`, 'page'); // When uncommented, the following error will be thrown
  // Error: "Route /invoices/[invoiceId]/payment used "revalidatePath /invoices/107" during render which is unsupported. To ensure revalidation is performed consistently it must //always happen outside of renders and cached functions. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering" occurred while processing your request
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId } = auth();

  if (!userId) return;

  const id = formData.get('id') as string;

  await db
    .delete(Invoices)
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

  redirect('/dashboard');
}

export async function createPayment(formData: FormData) {
  const headersList = await headers();
  const origin = headersList.get('origin');
  const id = parseInt(formData.get('id') as string);

  const [result] = await db
    .select({
      status: Invoices.status,
      value: Invoices.value,
    })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'bgn',
          product: 'prod_R6iYDVpFjLFKON',
          unit_amount: result.value,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) {
    throw new Error('Invalid Session');
  }

  redirect(session.url);
}
