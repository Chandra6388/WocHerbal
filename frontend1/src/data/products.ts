
export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string;
  category: 'herbal' | 'ayurvedic' | 'natural';
  description: string;
  ingredients: string[];
  benefits: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  volume: string;
  isPrimary?: boolean;
  weight?: number;
}

export const products: Product[] = [
  {
    _id: '6887c6790643ee4d75bd69c0',
    name: 'WOC Panchgavya Ayurvedic Herbal Hair Oil',
    price: 999,
    originalPrice: 1500,
    images: '/uploads/96af52de-e5d2-4f86-a7c6-e71952e09270.png',
    category: 'ayurvedic',
    volume: '100ml',
    weight: 270,
    description: 'Discover the magic of Ayurveda with WOC Panchgavya Ayurvedic Herbal Hair Oil, a powerful blend of 30 premium natural herbs, designed to nourish, strengthen, and rejuvenate your hair from the roots. Crafted using the traditional Kshir Pak method and enriched with Indigenous cow milk, this hair oil provides deep nourishment to your scalp and hair, delivering a healthy, shiny, and revitalized look.',
    ingredients: ['Panchgavya', 'Tulsi', 'Palmarosa Oil', 'Moringa Leaves', 'Lemon Extract', 'Brahmi', 'Amla', 'Bhringraj', 'Neem', 'Coconut Oil', 'Sesame Oil'],
    benefits: [
      'Reduces Hair Fall Naturally',
      'Removes Dandruff & Itchiness',
      'Improves Hair Texture & Shine',
      '100% Chemical-Free & Safe for All Ages',
      'Promotes New Hair Growth',
      'Non-Sticky, Fast Absorbing Formula',
      'Enhances scalp hydration',
      'Root strength charger',
      'Vitamin boost for volume',
      'Scalp detox shield',
      'Natural shine enhancer',
      'Thickens hair naturally',
      'Helps prevent split ends',
      'Acts as natural conditioner',
      'Scalp soother and calmer'
    ],
    inStock: true,
    rating: 4.9,
    reviews: 100,
    isPrimary: true
  }
];

export const getPrimaryProduct = () => {
  return products.find(p => p.isPrimary) || products[0];
};

export const featuredProduct = products[0];
