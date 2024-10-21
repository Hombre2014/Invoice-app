'use client';

import NextError from 'next/error';

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex flex-col justify-center items-center h-full mt-10">
      <h1 className="text-3xl font-semibold mb-6">Error</h1>
      <p className="text-lg">
        An error{' '}
        <span className="text-red-600 font-bold">"{error.message}"</span>{' '}
        occurred while processing your request.
      </p>

      <NextError statusCode={500} title={error.message} />
    </div>
  );
}
