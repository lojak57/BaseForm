
import { Product } from "@/context/CartContext";

export const categories = [
  {
    id: "crossbody",
    slug: "crossbody",
    name: "Crossbody Bags",
    description: "Perfect hands-free option for everyday adventures.",
    image: "/images/categories/crossbody.jpg"
  },
  {
    id: "tote",
    slug: "tote",
    name: "Tote Bags",
    description: "Spacious and stylish totes for work and travel.",
    image: "/images/categories/tote.jpg"
  },
  {
    id: "clutch",
    slug: "clutch",
    name: "Clutch Purses",
    description: "Elegant clutches for special occasions.",
    image: "/images/categories/clutch.jpg"
  },
  {
    id: "backpack",
    slug: "backpack",
    name: "Mini Backpacks",
    description: "Cute and functional mini backpacks for daily use.",
    image: "/images/categories/backpack.jpg"
  }
];

export const products: Product[] = [
  // Crossbody Bag
  {
    id: "mountain-crossbody",
    slug: "mountain-crossbody",
    categoryId: "crossbody",
    name: "Mountain Trail Crossbody",
    price: 125,
    description: "This versatile crossbody features an adjustable strap and multiple compartments for organization. Perfect for hiking trails or city adventures, it combines Colorado-inspired aesthetics with practical design. Each bag is handcrafted with love and attention to detail, ensuring a unique piece that will last for years to come.\n\nDimensions: 9\"W x 7\"H x 3\"D\nAdjustable strap: 44\"-52\"\nInterior features: One zippered pocket, two slip pockets",
    defaultImages: [
      "/images/products/crossbody/mountain-trail-natural.jpg",
      "/images/products/crossbody/mountain-trail-detail.jpg",
      "/images/products/crossbody/mountain-trail-inside.jpg"
    ],
    fabrics: [
      {
        code: "natural",
        label: "Natural Canvas",
        upcharge: 0,
        swatch: "/images/swatches/natural.jpg"
      },
      {
        code: "navy",
        label: "Navy Canvas",
        upcharge: 0,
        swatch: "/images/swatches/navy.jpg",
        imgOverride: ["/images/products/crossbody/mountain-trail-navy.jpg"]
      },
      {
        code: "rustic",
        label: "Rustic Leather",
        upcharge: 45,
        swatch: "/images/swatches/rustic-leather.jpg",
        imgOverride: ["/images/products/crossbody/mountain-trail-rustic.jpg"]
      },
      {
        code: "floral",
        label: "Mountain Floral",
        upcharge: 15,
        swatch: "/images/swatches/floral.jpg",
        imgOverride: ["/images/products/crossbody/mountain-trail-floral.jpg"]
      }
    ]
  },
  // Tote Bag
  {
    id: "aspen-tote",
    slug: "aspen-tote",
    categoryId: "tote",
    name: "Aspen Market Tote",
    price: 145,
    description: "Our spacious Aspen Market Tote is perfect for farmers markets, shopping trips, or as a stylish work bag. With sturdy handles and a roomy interior, it combines function and Colorado style in one beautiful handcrafted package. The reinforced bottom ensures durability, while the interior pocket keeps your essentials organized.\n\nDimensions: 16\"W x 14\"H x 5\"D\nHandle drop: 9\"\nInterior features: One large zippered pocket, key leash",
    defaultImages: [
      "/images/products/tote/aspen-tote-natural.jpg", 
      "/images/products/tote/aspen-tote-detail.jpg",
      "/images/products/tote/aspen-tote-inside.jpg"
    ],
    fabrics: [
      {
        code: "natural",
        label: "Natural Canvas",
        upcharge: 0,
        swatch: "/images/swatches/natural.jpg"
      },
      {
        code: "denim",
        label: "Denim",
        upcharge: 15,
        swatch: "/images/swatches/denim.jpg",
        imgOverride: ["/images/products/tote/aspen-tote-denim.jpg"]
      },
      {
        code: "sage",
        label: "Sage Waxed Canvas",
        upcharge: 25,
        swatch: "/images/swatches/sage.jpg",
        imgOverride: ["/images/products/tote/aspen-tote-sage.jpg"]
      },
      {
        code: "stripe",
        label: "Mountain Stripe",
        upcharge: 20,
        swatch: "/images/swatches/stripe.jpg",
        imgOverride: ["/images/products/tote/aspen-tote-stripe.jpg"]
      }
    ]
  },
  // Clutch
  {
    id: "evening-clutch",
    slug: "evening-clutch",
    categoryId: "clutch",
    name: "Evening Star Clutch",
    price: 95,
    description: "The Evening Star Clutch adds elegance to any outfit. Perfect for special occasions or a night out, this hand-sewn clutch features a magnetic closure and a detachable wristlet strap. The compact design holds all your essentials while maintaining a sleek profile. Each piece is finished with our signature gold-toned hardware.\n\nDimensions: 11\"W x 6\"H x 1\"D\nWristlet strap: 7\" drop\nInterior features: One slip pocket, three card slots",
    defaultImages: [
      "/images/products/clutch/evening-star-black.jpg",
      "/images/products/clutch/evening-star-detail.jpg",
      "/images/products/clutch/evening-star-inside.jpg"
    ],
    fabrics: [
      {
        code: "black",
        label: "Black Velvet",
        upcharge: 0,
        swatch: "/images/swatches/black-velvet.jpg"
      },
      {
        code: "navy",
        label: "Navy Satin",
        upcharge: 10,
        swatch: "/images/swatches/navy-satin.jpg",
        imgOverride: ["/images/products/clutch/evening-star-navy.jpg"]
      },
      {
        code: "silver",
        label: "Silver Metallic",
        upcharge: 15,
        swatch: "/images/swatches/silver.jpg",
        imgOverride: ["/images/products/clutch/evening-star-silver.jpg"]
      },
      {
        code: "embroidered",
        label: "Embroidered Floral",
        upcharge: 35,
        swatch: "/images/swatches/embroidered.jpg",
        imgOverride: ["/images/products/clutch/evening-star-embroidered.jpg"]
      }
    ]
  },
  // Mini Backpack
  {
    id: "alpine-backpack",
    slug: "alpine-backpack",
    categoryId: "backpack",
    name: "Alpine Mini Backpack",
    price: 165,
    description: "Our Alpine Mini Backpack combines cute styling with mountain-ready durability. Perfect for day hikes or urban adventures, this compact backpack features adjustable straps and multiple pockets for organization. The water-resistant outer fabric keeps your belongings protected, while the padded back panel ensures comfort all day long.\n\nDimensions: 10\"W x 12\"H x 4\"D\nAdjustable straps: 20\"-30\"\nInterior features: One zippered pocket, laptop/tablet sleeve (fits up to 10\" tablet)",
    defaultImages: [
      "/images/products/backpack/alpine-backpack-waxed.jpg",
      "/images/products/backpack/alpine-backpack-detail.jpg",
      "/images/products/backpack/alpine-backpack-inside.jpg"
    ],
    fabrics: [
      {
        code: "waxed",
        label: "Brown Waxed Canvas",
        upcharge: 0,
        swatch: "/images/swatches/waxed.jpg"
      },
      {
        code: "olive",
        label: "Olive Canvas",
        upcharge: 0,
        swatch: "/images/swatches/olive.jpg",
        imgOverride: ["/images/products/backpack/alpine-backpack-olive.jpg"]
      },
      {
        code: "burgundy",
        label: "Burgundy Canvas",
        upcharge: 0,
        swatch: "/images/swatches/burgundy.jpg",
        imgOverride: ["/images/products/backpack/alpine-backpack-burgundy.jpg"]
      },
      {
        code: "mountain",
        label: "Mountain Print",
        upcharge: 25,
        swatch: "/images/swatches/mountain.jpg",
        imgOverride: ["/images/products/backpack/alpine-backpack-mountain.jpg"]
      }
    ]
  }
];

// Helper function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Helper function to get products by category
export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.categoryId === categoryId);
};

// Helper function to get category by slug
export const getCategoryBySlug = (slug: string) => {
  return categories.find(category => category.slug === slug);
};

// Helper function to get product by slug
export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};
