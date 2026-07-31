import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Design Guide",
  description: "Chemistry portal Design System and Typography component guides",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
