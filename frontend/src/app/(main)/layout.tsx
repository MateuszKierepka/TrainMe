import { getCurrentUser } from "@/lib/session";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <AuthProvider user={user}>
      <Navbar />
      {children}
    </AuthProvider>
  );
}
