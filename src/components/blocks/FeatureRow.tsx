
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureRowProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
}

const FeatureRow = ({ title, subtitle, features }: FeatureRowProps) => {
  return (
    <section className="py-16 bg-ivory">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && <p className="text-threadGold font-medium mb-2">{subtitle}</p>}
            {title && <h2 className="font-playfair text-3xl md:text-4xl">{title}</h2>}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-white hover:shadow-soft transition-all duration-300">
              <div className="w-16 h-16 flex items-center justify-center text-threadGold mb-4">
                {feature.icon}
              </div>
              <h3 className="font-playfair text-xl mb-3">{feature.title}</h3>
              <p className="text-darkGray">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureRow;
