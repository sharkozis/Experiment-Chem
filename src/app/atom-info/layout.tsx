import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Atom Info",
  description: "Helium atom structural details and electron configuration",
};

export default function AtomInfoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
