
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqs = [
    {
      question: "What is HabitVault?",
      answer: "HabitVault is a habit tracking application that helps you build positive habits and break negative ones through visual streak tracking, analytics, and personalized insights."
    },
    {
      question: "How do I create a new habit?",
      answer: "To create a new habit, log in to your account and go to your dashboard. Click on the 'Add Habit' button, fill in the habit details including name, frequency, and reminders, then save your new habit."
    },
    {
      question: "Can I track both daily and weekly habits?",
      answer: "Yes! HabitVault allows you to track habits with various frequencies including daily, specific days of the week, weekly, or custom intervals to fit your personal routine."
    },
    {
      question: "How does streak tracking work?",
      answer: "Streaks are counted as consecutive days or periods where you've completed your habit. If you miss a day for a daily habit, your streak resets to zero. For weekly habits, you need to complete it within the defined week to maintain your streak."
    },
    {
      question: "Can I export my habit data?",
      answer: "Yes, HabitVault allows you to export your habit data as CSV or JSON files from the Settings page. This is useful for personal analysis or backup purposes."
    },
    {
      question: "Is there a mobile app available?",
      answer: "We're currently developing mobile apps for iOS and Android. In the meantime, our web application is fully responsive and works great on mobile browsers."
    },
    {
      question: "How do I delete my account?",
      answer: "You can delete your account by going to Settings > Account > Delete Account. Please note that this action is permanent and will remove all your data from our systems."
    }
  ];
  
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;
  
  return (
    <div className="py-24">
      <div className="container px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6">Help Center</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Find answers to common questions about using HabitVault
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for answers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-foreground/80">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <p className="mb-4 text-foreground/70">No results found for "{searchQuery}"</p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>Clear Search</Button>
            </div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 bg-card p-8 rounded-xl border border-border/40 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-lg text-foreground/70 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link to="/contact">
            <Button className="bg-habit-purple hover:bg-habit-purple/90">
              Contact Support
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;
