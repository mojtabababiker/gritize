import DashboardHeader from "@/components/base/DashboardHeader";
import Sidebar from "@/components/base/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* header */}
      <DashboardHeader />
      {/* sidebar */}
      <Sidebar />
      {children}
    </>
  );
}
