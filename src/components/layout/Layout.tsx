import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Decorative elements using accent and secondary colors */}
      <div className="fixed z-0 top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-threadGold to-accent opacity-70"></div>
      
      {/* Decorative corner elements */}
      <div className="fixed top-0 right-0 w-24 h-24 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-12 h-12 bg-accent/5 rounded-bl-full"></div>
      </div>
      <div className="fixed bottom-0 left-0 w-24 h-24 -z-10 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-secondary/5 rounded-tr-full"></div>
      </div>
      
      <Header />
      <main className="flex-grow pt-28 md:pt-36 relative z-0">{children}</main>
      <Footer />
      
      {/* Floating accent-colored bubble decorations */}
      <div className="fixed w-4 h-4 rounded-full bg-secondary/20 -z-10 animate-float-slow" style={{ top: '15%', left: '5%' }}></div>
      <div className="fixed w-6 h-6 rounded-full bg-accent/10 -z-10 animate-float" style={{ bottom: '10%', right: '10%' }}></div>
    </div>
  );
};

export default Layout;
