import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us",
  description: "About our chemistry portal - Coming soon",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
