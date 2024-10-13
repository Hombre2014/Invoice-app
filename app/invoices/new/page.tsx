import { Button } from '@/components/ui/button';

export default function NewInvoice() {
  return (
    <main className="flex flex-col justify-center text-center gap-6 max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Create a New Invoice</h1>
      </div>

      <form action="/action">
        <div>
          <label htmlFor="name">Billing Name</label>
          <input type="text" name="name" title="name" />
        </div>

        <div>
          <label htmlFor="email">Billing Email</label>
          <input type="email" name="email" title="email" />
        </div>

        <div>
          <label htmlFor="value">Value</label>
          <input type="text" name="value" title="value" />
        </div>

        <div>
          <label htmlFor="value">Description</label>
          <textarea name="description" title="description"></textarea>
        </div>
      </form>
    </main>
  );
}
