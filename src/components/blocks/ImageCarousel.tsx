
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  aspectRatio?: "square" | "portrait" | "landscape";
  selectedFabricImage?: string;
}

const ImageCarousel = ({ 
  images, 
  alt, 
  aspectRatio = "square",
  selectedFabricImage
}: ImageCarouselProps) => {
  const [mainImage, setMainImage] = useState(selectedFabricImage || images[0]);
  const [thumbnails, setThumbnails] = useState<string[]>(images);

  useEffect(() => {
    if (selectedFabricImage) {
      setMainImage(selectedFabricImage);
      
      // Ensure the selected fabric image is first in the thumbnails
      const newThumbnails = [...images];
      if (!newThumbnails.includes(selectedFabricImage)) {
        newThumbnails[0] = selectedFabricImage;
      } else {
        // Move the selected fabric image to the front
        const index = newThumbnails.indexOf(selectedFabricImage);
        newThumbnails.splice(index, 1);
        newThumbnails.unshift(selectedFabricImage);
      }
      setThumbnails(newThumbnails);
    } else {
      setMainImage(images[0]);
      setThumbnails(images);
    }
  }, [images, selectedFabricImage]);

  // Apply aspect ratio classes
  let aspectRatioClass = "aspect-square";
  if (aspectRatio === "portrait") {
    aspectRatioClass = "aspect-[3/4]";
  } else if (aspectRatio === "landscape") {
    aspectRatioClass = "aspect-[4/3]";
  }

  return (
    <div>
      {/* Main image */}
      <div className={`mb-4 rounded-lg overflow-hidden ${aspectRatioClass}`}>
        <img
          src={mainImage}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails carousel */}
      {thumbnails.length > 1 && (
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: thumbnails.length > 3,
          }}
        >
          <CarouselContent className="-ml-2">
            {thumbnails.map((image, index) => (
              <CarouselItem key={index} className="pl-2 basis-1/4 sm:basis-1/5">
                <div
                  className={`cursor-pointer rounded-md overflow-hidden border-2 transition-colors ${
                    image === mainImage
                      ? "border-threadGold"
                      : "border-transparent hover:border-threadGold/50"
                  }`}
                  onClick={() => setMainImage(image)}
                >
                  <img
                    src={image}
                    alt={`${alt} thumbnail ${index + 1}`}
                    className="aspect-square object-cover w-full"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 bg-white/80" />
          <CarouselNext className="right-0 bg-white/80" />
        </Carousel>
      )}
    </div>
  );
};

export default ImageCarousel;
