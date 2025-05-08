
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-xl px-4">
          <h1 className="font-playfair text-5xl md:text-6xl mb-6">404</h1>
          <p className="text-threadGold text-xl mb-2">Page Not Found</p>
          <p className="text-darkGray mb-8">
            We're sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/" className="btn-primary">
              Return to Home
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
