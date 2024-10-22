import Link from 'next/link';
import Container from './Container';

const Footer = () => {
  return (
    <footer className="mt-12 mb-8">
      <Container className="flex justify-between gap-4">
        <p className="text-sm">
          Invoicepedia &copy; {new Date().getFullYear()}
        </p>
        <p className="text-sm">
          Created by{' '}
          <Link
            href="https://yuriy-portfolio.netlify.app/"
            rel="noopener"
            target="_blank"
          >
            <span className="font-semibold hover:text-blue-500">AXE_BIT</span>
          </Link>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
