import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-grow pt-28 md:pt-36 relative z-0">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
