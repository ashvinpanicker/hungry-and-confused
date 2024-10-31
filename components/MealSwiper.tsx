"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMeals } from '@/data/meals';
import { Preferences, Meal } from '@/types/meal';
import { Skeleton } from '@/components/ui/skeleton';

interface MealSwiperProps {
  preferences: Preferences;
}

export default function MealSwiper({ preferences }: MealSwiperProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [accepted, setAccepted] = useState<number[]>([]);

  useEffect(() => {
    const loadMeals = async () => {
      const fetchedMeals = await getMeals();
      setMeals(fetchedMeals.filter(
        (meal) => preferences.diet === 'any' || meal.diet === preferences.diet
      ));
      setLoading(false);
    };
    loadMeals();
  }, [preferences.diet]);

  const currentMeal = meals[currentIndex];

  const handleSwipe = (accept: boolean) => {
    if (!currentMeal) return;
    
    if (accept) {
      setAccepted([...accepted, currentMeal.id]);
    }
    setDirection(accept ? 1 : -1);
    setTimeout(() => {
      setDirection(0);
      setCurrentIndex((prev) =>
        prev < meals.length - 1 ? prev + 1 : prev
      );
    }, 300);
  };

  if (loading) {
    return (
      <Card className="max-w-md mx-auto overflow-hidden">
        <Skeleton className="h-64 w-full" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </Card>
    );
  }

  if (!currentMeal || currentIndex >= meals.length) {
    return (
      <Card className="max-w-md mx-auto p-6 bg-zinc-800/50 border-zinc-700 text-center">
        <h2 className="text-2xl font-bold mb-4">All set!</h2>
        <p className="text-zinc-400 mb-4">
          You've selected {accepted.length} meals.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500"
        >
          Start Over
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMeal.id}
          initial={{ scale: 1 }}
          animate={{
            x: direction * 200,
            opacity: direction === 0 ? 1 : 0,
            scale: direction === 0 ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Card className="overflow-hidden bg-zinc-800/50 border-zinc-700">
            <div
              className="h-64 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentMeal.image})` }}
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{currentMeal.name}</h3>
                  <p className="text-zinc-400">{currentMeal.restaurant}</p>
                </div>
                <Badge variant="secondary" className="text-lg">
                  ₹{currentMeal.price}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {currentMeal.rating}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {currentMeal.distance}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentMeal.prepTime}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 p-0 border-zinc-700 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500"
          onClick={() => handleSwipe(false)}
        >
          <ThumbsDown className="w-6 h-6" />
        </Button>
        <Button
          size="lg"
          className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500"
          onClick={() => handleSwipe(true)}
        >
          <ThumbsUp className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}