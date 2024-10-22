'use client';

import Form from 'next/form';
import { SyntheticEvent, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { createInvoice } from '@/app/actions';
import Container from '@/components/Container';
import { Textarea } from '@/components/ui/textarea';
import SubmitButton from '@/components/SubmitButton';

export default function NewInvoice() {
  const [state, setState] = useState('ready');

  async function handleOnSubmit(event: SyntheticEvent) {
    if (state === 'pending') {
      event.preventDefault();
      return;
    }
    setState('pending');
  }

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-semibold">Create a New Invoice</h1>
        </div>

        <Form
          action={createInvoice}
          onSubmit={handleOnSubmit}
          className="grid gap-4 max-w-xs"
        >
          <div>
            <Label
              className="block mb-2 font-semibold text-small"
              htmlFor="name"
            >
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
            <Textarea name="description" id="description" rows={6}></Textarea>
          </div>

          <SubmitButton />
        </Form>
      </Container>
    </main>
  );
}
