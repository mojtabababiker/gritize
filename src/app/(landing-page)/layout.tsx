import Header from "@/components/base/Header";
import Footer from "@/components/base/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* header */}
      <Header />
      {children}
      {/* footer */}
      <Footer />
    </>
  );
}
