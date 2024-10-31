import axios from 'axios';

const SWIGGY_API_URL = 'https://www.swiggy.com/dapi/restaurants/list/v5';
const SWIGGY_MENU_API = 'https://www.swiggy.com/dapi/menu/pl/v2';

// Bengaluru coordinates (default to Koramangala)
const DEFAULT_LAT = 12.9351929;
const DEFAULT_LNG = 77.62448069999999;

const headers = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
};

export async function fetchRestaurants() {
  try {
    const response = await axios.get(`${SWIGGY_API_URL}`, {
      params: {
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
        page_type: 'DESKTOP_WEB_LISTING',
      },
      headers,
    });

    const restaurants = response.data?.data?.cards?.find(
      (card: any) => card?.card?.card?.gridElements?.infoWithStyle?.restaurants
    )?.card?.card?.gridElements?.infoWithStyle?.restaurants || [];

    return restaurants.map((restaurant: any) => ({
      id: restaurant.info.id,
      name: restaurant.info.name,
      image: restaurant.info.cloudinaryImageId 
        ? `https://res.cloudinary.com/swiggy/image/upload/${restaurant.info.cloudinaryImageId}`
        : null,
      rating: restaurant.info.avgRating,
      price: restaurant.info.costForTwo / 100, // Convert to actual price
      distance: `${(restaurant.info.sla.lastMileTravel || 0).toFixed(1)} km`,
      prepTime: `${restaurant.info.sla.deliveryTime || 30} mins`,
      isVeg: restaurant.info.veg,
    }));
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
}

export async function fetchMenuItems(restaurantId: string) {
  try {
    const response = await axios.get(`${SWIGGY_MENU_API}`, {
      params: {
        restaurantId,
      },
      headers,
    });

    const menuItems = response.data?.data?.cards
      ?.find((card: any) => card?.groupedCard)
      ?.groupedCard?.cardGroupMap?.REGULAR?.cards?.filter(
        (card: any) => card?.card?.card?.itemCards
      )
      ?.flatMap((card: any) => card.card.card.itemCards) || [];

    return menuItems.map((item: any) => ({
      id: item.card.info.id,
      name: item.card.info.name,
      description: item.card.info.description,
      price: item.card.info.price / 100, // Convert to actual price
      image: item.card.info.imageId 
        ? `https://res.cloudinary.com/swiggy/image/upload/${item.card.info.imageId}`
        : null,
      isVeg: item.card.info.isVeg === 1,
    }));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}