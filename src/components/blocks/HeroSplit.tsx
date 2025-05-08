
import { Link } from "react-router-dom";

interface HeroSplitProps {
  title: string;
  subtitle?: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  imageAlt: string;
  reversed?: boolean;
}

const HeroSplit = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  image,
  imageAlt,
  reversed = false,
}: HeroSplitProps) => {
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${reversed ? 'md:grid-cols-[55%_45%]' : 'md:grid-cols-[45%_55%]'} gap-8 md:gap-12 items-center`}>
          <div className={`${reversed ? 'md:order-2' : ''}`}>
            <div className="max-w-xl">
              {subtitle && (
                <p className="text-threadGold font-medium mb-2">{subtitle}</p>
              )}
              <h1 className="font-playfair text-3xl md:text-5xl leading-tight mb-6">
                {title}
              </h1>
              <p className="text-darkGray text-lg mb-8 leading-relaxed">
                {description}
              </p>
              <Link to={ctaLink} className="btn-primary inline-block">
                {ctaText}
              </Link>
            </div>
          </div>
          <div className={`${reversed ? 'md:order-1' : ''}`}>
            <div className="relative">
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-auto rounded-lg shadow-product"
              />
              <div className="absolute inset-0 border-2 border-threadGold/20 rounded-lg -m-3 md:-m-5 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSplit;
