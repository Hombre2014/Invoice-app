import { SignIn } from '@clerk/nextjs';

import Container from '@/components/Container';

export default function SignInPage() {
  return (
    <Container className="flex justify-center">
      <SignIn />
    </Container>
  );
}
