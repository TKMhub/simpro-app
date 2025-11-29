import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="pt-16 min-h-[calc(100dvh-6rem)]">{children}</div>
      <Footer />
    </>
  );
}

