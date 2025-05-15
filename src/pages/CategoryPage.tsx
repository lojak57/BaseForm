import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import CardGallery from "@/components/blocks/CardGallery";
import { getCategoryBySlug } from "@/data/categories";
import { useProducts } from "@/context/ProductContext";
import { Loader2 } from "lucide-react";

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
          <Link to="/" className="btn-primary">
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
          <Loader2 className="h-8 w-8 animate-spin text-threadGold mr-2" />
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
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex space-x-2 text-sm text-darkGray">
              <li>
                <Link to="/" className="hover:text-threadGold transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-darkText font-medium">{category.name}</li>
            </ol>
          </nav>

          <div className="mb-12">
            <h1 className="font-playfair text-3xl md:text-4xl mb-4">{category.name}</h1>
            <p className="text-darkGray max-w-2xl">{category.description}</p>
          </div>

          {/* Products */}
          {products.length > 0 ? (
            <CardGallery products={products} />
          ) : (
            <div className="text-center py-12">
              <p className="text-darkGray mb-8">No products available in this category yet.</p>
              <Link to="/" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
