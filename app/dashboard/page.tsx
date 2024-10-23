import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { CirclePlus } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/db';
import { cn } from '@/lib/utils';
import { Invoices } from '@/db/schema';
import { Badge } from '@/components/ui/badge';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const results = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.userId, userId));

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-semibold">Invoices</h1>
          <p>
            <Button className="inline-flex gap-2" variant="ghost" asChild>
              <Link href="/invoices/new">
                <CirclePlus className="h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </p>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] p-4">Date</TableHead>
              <TableHead className="p-4">Customer</TableHead>
              <TableHead className="p-4">Email</TableHead>
              <TableHead className="text-center p-4">Status</TableHead>
              <TableHead className="text-right p-4">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => {
              return (
                <TableRow key={result.id}>
                  <TableCell className="font-medium text-left p-0">
                    <Link
                      href={`/invoices/${result.id}`}
                      className="font-semibold block p-4"
                    >
                      {new Date(result.createTs).toLocaleDateString()}
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0">
                    <Link
                      href={`/invoices/${result.id}`}
                      className="font-semibold block p-4"
                    >
                      Philip J. Fry
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0">
                    <Link href={`/invoices/${result.id}`} className="block p-4">
                      philip@fry.com
                    </Link>
                  </TableCell>
                  <TableCell className="text-center p-0">
                    <Link href={`/invoices/${result.id}`} className="block p-4">
                      <Badge
                        className={cn(
                          'rounded-full capitalize',
                          result.status === 'open' && 'bg-blue-500',
                          result.status === 'paid' && 'bg-green-500',
                          result.status === 'void' && 'bg-gray-500',
                          result.status === 'uncollectible' && 'bg-red-500'
                        )}
                      >
                        {result.status}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/invoices/${result.id}`}
                      className="font-semibold block p-4"
                    >
                      ${(result.value / 100).toFixed(2)}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}
