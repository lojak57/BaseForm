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

        <div id="contact-form">
          <SplitForm
            title="Send Us a Message"
            subtitle="Please fill out the form below and we'll get back to you within 24-48 hours."
            image={getProductImage()}
            altText="VC Sews handcrafted product"
          />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-threadGold/10 to-threadGold/20 p-8 md:p-10 rounded-lg shadow-md text-center border border-threadGold/30">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center text-threadGold bg-white rounded-full shadow-soft">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </div>
              
              <h3 className="font-playfair text-2xl md:text-3xl mb-4">Contact Us</h3>
              
              <div className="mb-6 text-lg">
                <div>
                  <p className="font-semibold">Email:</p>
                  <a href="mailto:hello@your-domain.com" className="text-threadGold hover:underline transition-colors font-medium">
                    hello@your-domain.com
                  </a>
                </div>
                <p className="text-darkText/80">
                  For custom orders, wholesale inquiries, or questions about your purchase
                </p>
              </div>
              
              <div className="mt-6 mb-3">
                <div className="w-16 h-0.5 bg-threadGold/30 mx-auto"></div>
              </div>
              
              <p className="text-darkText mb-6">
                We'd love to hear from you! Send us a message and we'll respond within 24-48 hours.
              </p>
              
              <a 
                href="#contact-form" 
                className="inline-block bg-threadGold text-darkText px-8 py-3 rounded-full font-medium shadow-md transition-all duration-300 hover:bg-white hover:text-threadGold transform hover:-translate-y-1 hover:shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  const formElement = document.getElementById('contact-form');
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Send us a message
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
