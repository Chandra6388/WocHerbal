
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'herbal' | 'ayurvedic' | 'natural';
  description: string;
  ingredients: string[];
  benefits: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  volume: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'WOC Panchgavya Ayurvedic Herbal Hair Oil',
    price: 999,
    originalPrice: 1299,
    image: '/uploads/4654272e-82ea-4eff-8386-6d9f4a2fcced.png',
    category: 'ayurvedic',
    volume: '100ml',
    description: 'Discover why WOC is a game-changer you\'ll love. Our premium Ayurvedic herbal hair oil combines traditional Panchgavya with powerful natural ingredients for healthy, beautiful hair.',
    ingredients: ['Panchgavya', 'Tulsi', 'Palmarosa Oil', 'Moringa Leaves', 'Lemon Extract', 'Brahmi', 'Amla', 'Bhringraj', 'Neem', 'Coconut Oil', 'Sesame Oil'],
    benefits: [
      'Reduces scalp odor naturally',
      'Fights lice and nits effectively',
      'Treats scalp infections',
      'Revives damaged hair',
      'Balances pH of the scalp',
      'Supports microbial balance',
      'Supports collagen production',
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
    reviews: 1247
  }
];

export const featuredProduct = products[0];
