import { sql } from 'drizzle-orm';

import { db } from '@/db';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default async function NewInvoice() {
  const results = await db.execute(sql`SELECT current_database()`);
  console.log(results);

  return (
    <main className="flex flex-col justify-center gap-6 max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Create a New Invoice</h1>
      </div>

      {JSON.stringify(results)}

      <form className="grid gap-4 max-w-xs">
        <div>
          <Label className="block mb-2 font-semibold text-small" htmlFor="name">
            Billing Name
          </Label>
          <Input type="text" name="name" id="name" />
        </div>

        <div>
          <Label
            className="block mb-2 font-semibold text-small"
            htmlFor="email"
          >
            Billing Email
          </Label>
          <Input type="email" name="email" id="email" />
        </div>

        <div>
          <Label
            className="block mb-2 font-semibold text-small"
            htmlFor="value"
          >
            Value
          </Label>
          <Input type="text" name="value" id="value" />
        </div>

        <div>
          <Label
            className="block mb-2 font-semibold text-small"
            htmlFor="value"
          >
            Description
          </Label>
          <Textarea name="description" id="description"></Textarea>
        </div>

        <Button type="submit" className="w-full font-semibold">
          Submit
        </Button>
      </form>
    </main>
  );
}
