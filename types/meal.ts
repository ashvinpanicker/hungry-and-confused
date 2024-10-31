export interface Meal {
  id: number;
  name: string;
  restaurant: string;
  price: number;
  rating: number;
  image: string;
  distance: string;
  prepTime: string;
  diet: 'veg' | 'non-veg';
}

export interface Preferences {
  people: string;
  diet: 'any' | 'veg' | 'non-veg';
}