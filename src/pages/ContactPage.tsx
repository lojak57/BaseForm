import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SplitForm from "@/components/blocks/SplitForm";
import { useProducts } from "@/context/ProductContext";

const ContactPage = () => {
  const { products } = useProducts();
  
  // Get a high-quality product image for the contact form
  const getProductImage = () => {
    // Try to find images from specific categories first for better display
    const preferredCategories = ['purses', 'bags']; 
    
    // Look for products in preferred categories first
    for (const categoryId of preferredCategories) {
      const categoryProducts = products.filter(
        product => product.categoryId === categoryId && 
        product.defaultImages && 
        product.defaultImages.length > 0
      );
      
      if (categoryProducts.length > 0) {
        // Sort by product name to get a more consistent image selection
        const sortedProducts = [...categoryProducts].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        
        // Use the second image if available (often shows the full product better)
        const selectedProduct = sortedProducts[0];
        if (selectedProduct.defaultImages.length >= 2) {
          return selectedProduct.defaultImages[1];
        }
        return selectedProduct.defaultImages[0];
      }
    }
    
    // Fallback: Find any product with multiple images and use the second image
    const productsWithMultipleImages = products.filter(
      product => product.defaultImages && product.defaultImages.length >= 2
    );
    
    if (productsWithMultipleImages.length > 0) {
      return productsWithMultipleImages[0].defaultImages[1];
    }
    
    // Second fallback: Find any product with at least one image
    const productWithImage = products.find(
      product => product.defaultImages && product.defaultImages.length > 0
    );
    
    // Return the image or fallback to the default
    return productWithImage?.defaultImages[0] || "/images/contact.jpg";
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center mb-12">
          <h1 className="font-playfair text-3xl md:text-4xl mb-4">Get in Touch</h1>
          <p className="text-darkGray">
            Have a question about a product, interested in a custom order, or want to learn more about VC Sews? We'd love to hear from you!
          </p>
        </div>

        <SplitForm
          title="Send Us a Message"
          subtitle="Please fill out the form below and we'll get back to you within 24-48 hours."
          image={getProductImage()}
          altText="VC Sews handcrafted product"
        />

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-soft text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-threadGold">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="font-playfair text-xl mb-2">Visit Us</h3>
              <address className="not-italic text-darkGray">
                <p>123 Stitch Lane</p>
                <p>Boulder, CO 80303</p>
                <p className="mt-2">Open by appointment only</p>
              </address>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-soft text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-threadGold">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3 className="font-playfair text-xl mb-2">Call Us</h3>
              <p className="text-darkGray">
                <a href="tel:+13039876543" className="hover:text-threadGold transition-colors">
                  (303) 987-6543
                </a>
              </p>
              <p className="mt-2 text-darkGray">
                Monday - Friday: 9am - 5pm MT
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-soft text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-threadGold">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </div>
              <h3 className="font-playfair text-xl mb-2">Email Us</h3>
              <p className="text-darkGray">
                <a href="mailto:hello@vcsews.com" className="hover:text-threadGold transition-colors">
                  hello@vcsews.com
                </a>
              </p>
              <p className="mt-2 text-darkGray">
                For custom orders or wholesale inquiries
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
