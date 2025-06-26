
import { LandingShell } from '../../components/layout/LandingShell';

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LandingShell>
      {children}
    </LandingShell>
  );
}
