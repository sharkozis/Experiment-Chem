import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Experiment",
  description: "Chemistry lab experiments - Coming soon",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
