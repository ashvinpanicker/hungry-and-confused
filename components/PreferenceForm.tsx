"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import MealDeck from '@/components/MealDeck';
import { Users, Utensils } from 'lucide-react';

export default function PreferenceForm() {
  const [started, setStarted] = useState(false);
  const [preferences, setPreferences] = useState({
    diners: 1,
    dietType: 'any'
  });

  if (started) {
    return <MealDeck preferences={preferences} />;
  }

  return (
    <Card className="max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Number of people
          </Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={preferences.diners}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              diners: parseInt(e.target.value) || 1
            }))}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Dietary Preference
          </Label>
          <RadioGroup
            value={preferences.dietType}
            onValueChange={(value) => setPreferences(prev => ({
              ...prev,
              dietType: value
            }))}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="any" id="any" />
              <Label htmlFor="any">Any</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="veg" id="veg" />
              <Label htmlFor="veg">Vegetarian</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="non-veg" id="non-veg" />
              <Label htmlFor="non-veg">Non-Vegetarian</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button 
        className="w-full"
        onClick={() => setStarted(true)}
      >
        Find Meals
      </Button>
    </Card>
  );
}