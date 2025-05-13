
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Quote, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// List of motivational quotes about habits and consistency
const quotes = [
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    text: "Habits are the compound interest of self-improvement.",
    author: "James Clear"
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "Your habits will determine your future.",
    author: "Jack Canfield"
  },
  {
    text: "A habit is something you can do without thinking – which is why most of us have so many of them.",
    author: "Frank A. Clark"
  },
  {
    text: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun"
  },
  {
    text: "The chains of habit are too light to be felt until they are too heavy to be broken.",
    author: "Warren Buffett"
  },
  {
    text: "First forget inspiration. Habit is more dependable. Habit will sustain you whether you're inspired or not.",
    author: "Octavia Butler"
  },
  {
    text: "Quality is not an act, it is a habit.",
    author: "Aristotle"
  },
  {
    text: "The quality of your life is determined by the quality of your habits.",
    author: "Brian Tracy"
  },
  {
    text: "Your daily habits define who you are. You are what you repeatedly do.",
    author: "Sean Covey"
  },
  {
    text: "Habits are the invisible architecture of everyday life.",
    author: "Gretchen Rubin"
  },
  {
    text: "You'll never change your life until you change something you do daily. The secret of your success is found in your daily routine.",
    author: "John C. Maxwell"
  },
  {
    text: "Good habits formed at youth make all the difference.",
    author: "Aristotle"
  },
  {
    text: "Champions keep playing until they get it right.",
    author: "Billie Jean King"
  }
];

// Get a quote based on the date (same quote each day)
const getDailyQuote = () => {
  const today = new Date();
  // Calculate day of year (1-365/366)
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const quoteIndex = dayOfYear % quotes.length;
  return quotes[quoteIndex];
};

interface DailyQuoteProps {
  onToggle?: () => void;
}

const DailyQuote: React.FC<DailyQuoteProps> = ({ onToggle }) => {
  const [quote, setQuote] = useState(() => {
    // Get stored quote or generate new daily quote
    const storedQuote = localStorage.getItem('habitvault-daily-quote');
    const storedDate = localStorage.getItem('habitvault-quote-date');
    const today = new Date().toDateString();
    
    if (storedQuote && storedDate === today) {
      return JSON.parse(storedQuote);
    }
    
    return getDailyQuote();
  });
  const [isChanging, setIsChanging] = useState(false);
  
  // Store the quote in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('habitvault-daily-quote', JSON.stringify(quote));
    localStorage.setItem('habitvault-quote-date', new Date().toDateString());
  }, [quote]);
  
  // Change to a random quote
  const changeQuote = () => {
    setIsChanging(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
      setIsChanging(false);
    }, 500);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <Quote className="h-6 w-6 text-habit-purple mt-1" />
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={changeQuote} title="Get another quote">
              <RefreshCw className="h-4 w-4" />
            </Button>
            {onToggle && (
              <Button variant="ghost" size="icon" onClick={onToggle} title="Hide quote">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {!isChanging && (
            <motion.div
              key={quote.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-2"
            >
              <blockquote className="text-lg font-medium italic">
                "{quote.text}"
              </blockquote>
              <footer className="mt-2 text-right text-muted-foreground">
                — {quote.author}
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default DailyQuote;
