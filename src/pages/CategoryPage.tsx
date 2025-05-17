import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import CardGallery from "@/components/blocks/CardGallery";
import { getCategoryBySlug } from "@/data/categories";
import { useProducts } from "@/context/ProductContext";
import { Loader2, ChevronRight } from "lucide-react";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug || "");
  const { loading, error, getProductsByCategory } = useProducts();
  
  const products = category ? getProductsByCategory(category.id) : [];
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <h1 className="font-playfair text-3xl mb-6">Category Not Found</h1>
          <p className="mb-8">The category you're looking for doesn't exist.</p>
          <Link to="/" className="bg-primary text-white px-6 py-3 rounded-md inline-block hover:bg-primary/90 transition-colors">
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading products...</span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <h1 className="font-playfair text-3xl mb-6">{category.name}</h1>
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8">
            Error loading products. Please try again later.
          </div>
          <Link to="/" className="bg-primary text-white px-6 py-3 rounded-md inline-block hover:bg-primary/90 transition-colors">
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-16 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -z-10 blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-accent/5 rounded-full -z-10 blur-3xl"></div>
        <div className="absolute top-40 left-1/4 w-6 h-24 bg-secondary/20 rounded-full -z-10 rotate-45"></div>
        <div className="absolute bottom-1/3 right-1/5 w-24 h-6 bg-accent/20 rounded-full -z-10 -rotate-12"></div>
        
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-darkGray">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li>
                <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent font-medium">
                  {category.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="h-1 w-6 bg-secondary rounded-full"></div>
              <div className="h-1 w-10 bg-primary rounded-full"></div>
              <div className="h-1 w-6 bg-accent rounded-full"></div>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl mb-6">{category.name}</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent mb-6"></div>
            <p className="text-darkGray max-w-2xl text-lg">{category.description}</p>
          </div>

          {/* Products */}
          {products.length > 0 ? (
            <div className="relative z-10">
              <CardGallery products={products} />
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100 relative overflow-hidden">
              {/* Decorative corner elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-accent/10 rounded-tr-full"></div>
              
              <p className="text-darkGray mb-8">No products available in this category yet.</p>
              <Link to="/" className="relative overflow-hidden group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-md transition-colors">
                {/* Decorative moving gradient on hover with accent and secondary colors */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary/0 via-secondary/20 to-accent/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                <span className="relative z-10">Continue Shopping</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
