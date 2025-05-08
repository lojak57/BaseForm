
import { Link } from "react-router-dom";
import { categories } from "@/data/products";

const CategoryGrid = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-threadGold font-medium mb-2">Our Collections</p>
          <h2 className="font-playfair text-3xl md:text-4xl">Shop by Category</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.slug}`}
              className="product-card group rounded-lg overflow-hidden relative"
            >
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-darkText/30 flex items-end p-6">
                  <div className="bg-ivory/95 w-full text-center py-3 px-4 rounded-md">
                    <h3 className="font-playfair text-xl text-darkText">{category.name}</h3>
                    <p className="text-darkGray text-sm mt-1">{category.description}</p>
                  </div>
                </div>
              </div>
              {/* Stitched border effect on hover */}
              <div className="absolute inset-0 border-[3px] border-dashed border-threadGold/0 rounded-lg transition-all duration-300 group-hover:border-threadGold/50 pointer-events-none"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
