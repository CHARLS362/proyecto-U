
import { SidebarProvider, Sidebar, SidebarInset } from '../../components/ui/sidebar';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AppHeader } from '../../components/layout/AppHeader';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="inset" collapsible="icon" side="left">
        <AdminSidebar />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
