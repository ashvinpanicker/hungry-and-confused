"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Timer, DollarSign, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data - in a real app, this would come from an API
const MOCK_MEALS = [
  {
    id: 1,
    name: "Margherita Pizza",
    restaurant: "Pizza Palace",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop",
    price: "$15",
    prepTime: "20 mins",
    distance: "0.5 miles",
    isVeg: true
  },
  {
    id: 2,
    name: "Chicken Biryani",
    restaurant: "Spice Garden",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop",
    price: "$18",
    prepTime: "30 mins",
    distance: "0.8 miles",
    isVeg: false
  },
  {
    id: 3,
    name: "Veggie Buddha Bowl",
    restaurant: "Green Leaf",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
    price: "$14",
    prepTime: "15 mins",
    distance: "1.2 miles",
    isVeg: true
  }
];

interface MealDeckProps {
  preferences: {
    diners: number;
    dietType: string;
  };
}

export default function MealDeck({ preferences }: MealDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<number[]>([]);

  const filteredMeals = MOCK_MEALS.filter(meal => {
    if (preferences.dietType === 'veg') return meal.isVeg;
    if (preferences.dietType === 'non-veg') return !meal.isVeg;
    return true;
  });

  const currentMeal = filteredMeals[currentIndex];

  const handleSwipe = (isLike: boolean) => {
    if (isLike) {
      setSelectedMeals(prev => [...prev, currentMeal.id]);
    }
    setDirection(isLike ? 'right' : 'left');
    setTimeout(() => {
      setDirection(null);
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  if (currentIndex >= filteredMeals.length) {
    return (
      <Card className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Matches</h2>
        {selectedMeals.length > 0 ? (
          <div className="space-y-4">
            {filteredMeals
              .filter(meal => selectedMeals.includes(meal.id))
              .map(meal => (
                <div key={meal.id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-semibold">{meal.name}</h3>
                    <p className="text-sm text-gray-600">{meal.restaurant}</p>
                  </div>
                  <span className="text-green-600 font-semibold">{meal.price}</span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-600">No meals selected. Try again with different preferences!</p>
        )}
        <Button 
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          Start Over
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <AnimatePresence>
        <motion.div
          key={currentMeal.id}
          initial={{ scale: 1 }}
          animate={{
            x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
            opacity: direction ? 0 : 1,
            scale: direction ? 0.8 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Card className="overflow-hidden">
            <img
              src={currentMeal.image}
              alt={currentMeal.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">{currentMeal.name}</h2>
              <p className="text-lg text-gray-600">{currentMeal.restaurant}</p>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {currentMeal.price}
                </span>
                <span className="flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  {currentMeal.prepTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {currentMeal.distance}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipe(false)}
          className="rounded-full p-6"
        >
          <ThumbsDown className="w-6 h-6" />
        </Button>
        <Button
          size="lg"
          onClick={() => handleSwipe(true)}
          className="rounded-full p-6 bg-green-500 hover:bg-green-600"
        >
          <ThumbsUp className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}