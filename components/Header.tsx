import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

import Container from './Container';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="mt-8 mb-12">
      <Container>
        <div className="flex justify-between items-center gap-4">
          <p className="font-bold">
            <Link href="/dashboard">Invoicepedia</Link>
          </p>
          <div>
            <SignedOut>
              <Link href="/dashboard">Sign In</Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
