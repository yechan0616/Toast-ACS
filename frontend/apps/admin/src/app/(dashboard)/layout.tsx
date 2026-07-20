import { AdminShell } from 'features/shell/components/AdminShell/AdminShell.index'
import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
