import { SignUp } from '@clerk/nextjs';

import Container from '@/components/Container';

export default function SignUpPage() {
  return (
    <Container className="flex justify-center">
      <SignUp />
    </Container>
  );
}
