import type { ReactNode } from "react";

// This layout is deprecated and the functionality has been moved to role-specific layouts.
export default function DeprecatedLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
