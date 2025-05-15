import { Link } from "react-router-dom";

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

const Hero = ({ title, subtitle, ctaText, ctaLink, imageUrl }: HeroProps) => {
  return (
    <div className="relative bg-darkText">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-darkText/40"></div>
      </div>
      
      {/* Hero content */}
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-white mb-4">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-8">
              {subtitle}
            </p>
          )}
          
          <Link 
            to={ctaLink} 
            className="inline-block bg-threadGold hover:bg-threadGold/90 text-darkText font-medium px-8 py-3 rounded-md transition-colors"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero; 