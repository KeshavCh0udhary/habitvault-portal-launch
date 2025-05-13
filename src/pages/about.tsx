
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="py-24">
      <div className="container px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">About HabitVault</h1>
          <p className="text-xl text-foreground/70">
            Empowering you to build lasting habits and reach your goals
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <p>
            HabitVault was created with a simple mission: to help people build and maintain
            positive habits through visual progress tracking and powerful analytics. We believe
            that sustainable change comes from consistent small actions, and our platform is
            designed to help you maintain that consistency.
          </p>
          
          <h2>Our Story</h2>
          <p>
            Founded in 2023 by a team of developers and productivity enthusiasts, HabitVault
            was born out of our own struggles with maintaining habits. We wanted a simple yet
            powerful tool that would help us visualize our progress and motivate us to keep going.
          </p>
          
          <p>
            After trying numerous existing apps, we found that most were either too complex or
            didn't provide the right kind of feedback to keep us motivated. So we decided to
            build our own solution - one that focuses on visual streaks and meaningful analytics.
          </p>
          
          <h2>Our Philosophy</h2>
          <p>
            At HabitVault, we believe in:
          </p>
          
          <ul>
            <li>
              <strong>Visual Motivation</strong> - Seeing your progress is a powerful motivator
              for continuing good habits
            </li>
            <li>
              <strong>Data-Driven Insights</strong> - Understanding your patterns helps you
              optimize your routine
            </li>
            <li>
              <strong>Simplicity</strong> - Habit tracking should be simple and frictionless
            </li>
            <li>
              <strong>Privacy</strong> - Your data is yours, and we're committed to protecting it
            </li>
          </ul>
          
          <h2>Our Team</h2>
          <p>
            We're a small but dedicated team of developers, designers, and productivity enthusiasts
            working remotely across the globe. We're united by our passion for building tools that
            help people improve their lives through better habits.
          </p>
          
          <div className="mt-12 text-center">
            <Link to="/register">
              <Button className="bg-habit-purple hover:bg-habit-purple/90 group">
                Start tracking your habits
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
