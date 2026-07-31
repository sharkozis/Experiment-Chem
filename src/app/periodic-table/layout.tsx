import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Periodic Table",
  description: "Interactive chemical periodic table elements dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
