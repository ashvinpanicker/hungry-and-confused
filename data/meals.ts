import { Meal } from '@/types/meal';
import { fetchRestaurants, fetchMenuItems } from '@/lib/api';

let cachedMeals: Meal[] | null = null;

export async function getMeals(): Promise<Meal[]> {
  if (cachedMeals) return cachedMeals;

  try {
    const restaurants = await fetchRestaurants();
    const meals: Meal[] = [];

    // Get menu items for first 5 restaurants (to avoid too many requests)
    for (const restaurant of restaurants.slice(0, 5)) {
      const menuItems = await fetchMenuItems(restaurant.id);
      
      // Add up to 3 menu items per restaurant
      menuItems.slice(0, 3).forEach((item: any) => {
        meals.push({
          id: parseInt(`${restaurant.id}${item.id}`.slice(-8)),
          name: item.name,
          restaurant: restaurant.name,
          price: item.price,
          rating: restaurant.rating,
          image: item.image || restaurant.image,
          distance: restaurant.distance,
          prepTime: restaurant.prepTime,
          diet: item.isVeg ? 'veg' : 'non-veg',
        });
      });
    }

    cachedMeals = meals;
    return meals;
  } catch (error) {
    console.error('Error getting meals:', error);
    return [];
  }
}