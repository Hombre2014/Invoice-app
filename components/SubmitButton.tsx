'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

const SubmitButton = () => {
  const { pending } = useFormStatus();
  console.log('pending: ', pending);

  return (
    <Button type="submit" className="w-full font-semibold">
      Submit
    </Button>
  );
};

export default SubmitButton;
