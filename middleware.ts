import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublic = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/invoices/(.*)/payment',
]);

export default clerkMiddleware((auth, request) => {
  const headers = new Headers(request.headers);
  headers.set('x-current-path', request.nextUrl.pathname);

  if (!isPublic(request)) {
    auth().protect();
  }

  return NextResponse.next({
    headers,
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
