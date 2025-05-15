import { useState } from 'react';

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  centerCrop?: boolean;
}

const FallbackImage = ({ 
  src, 
  alt, 
  fallbackSrc = "/images/placeholder.jpg",
  className,
  centerCrop = false,
  ...props 
}: FallbackImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  if (centerCrop) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={imgSrc}
          alt={alt}
          onError={handleError}
          className="absolute w-full h-full object-cover object-center"
          {...props}
        />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};

export default FallbackImage; 