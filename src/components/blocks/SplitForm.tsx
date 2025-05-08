
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

interface SplitFormProps {
  title: string;
  subtitle?: string;
  image: string;
  altText: string;
}

const SplitForm = ({ title, subtitle, image, altText }: SplitFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src={image}
              alt={altText}
              className="w-full h-auto rounded-lg shadow-product"
            />
            <div className="absolute inset-0 border-2 border-threadGold/20 rounded-lg -m-3 md:-m-5 -z-10"></div>
          </div>
          
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl mb-3">{title}</h2>
            {subtitle && <p className="text-darkGray mb-8">{subtitle}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-darkText mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-threadGold focus:border-threadGold"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-darkText mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-threadGold focus:border-threadGold"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-darkText mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-threadGold focus:border-threadGold"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-darkText mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-threadGold focus:border-threadGold"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SplitForm;
