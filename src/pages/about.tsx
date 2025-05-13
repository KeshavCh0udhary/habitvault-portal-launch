
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/logo';

const AboutPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="py-24">
      <div className="container px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <Logo variant="large" className="mb-6" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">About HabitVault</h1>
          <p className="text-xl text-foreground/70">
            Empowering you to build lasting habits and reach your goals
          </p>
        </motion.div>

        <motion.div 
          variants={containerAnimation}
          initial="hidden"
          animate="show"
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <motion.div variants={itemAnimation}>
            <p className="lead text-xl">
              HabitVault was created with a simple mission: to help people build and maintain
              positive habits through visual progress tracking and powerful analytics. We believe
              that sustainable change comes from consistent small actions, and our platform is
              designed to help you maintain that consistency.
            </p>
          </motion.div>
          
          <motion.h2 variants={itemAnimation} className="mt-10 flex items-center">
            <span className="size-8 mr-3 rounded-full bg-habit-purple/10 flex items-center justify-center text-habit-purple">
              <span className="text-lg">1</span>
            </span>
            Our Story
          </motion.h2>
          
          <motion.div variants={itemAnimation}>
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
          </motion.div>
          
          <motion.h2 variants={itemAnimation} className="mt-10 flex items-center">
            <span className="size-8 mr-3 rounded-full bg-habit-purple/10 flex items-center justify-center text-habit-purple">
              <span className="text-lg">2</span>
            </span>
            Our Philosophy
          </motion.h2>
          
          <motion.p variants={itemAnimation}>
            At HabitVault, we believe in:
          </motion.p>
          
          <motion.ul variants={containerAnimation} className="space-y-4 my-8">
            {[
              "Visual Motivation - Seeing your progress is a powerful motivator for continuing good habits",
              "Data-Driven Insights - Understanding your patterns helps you optimize your routine",
              "Simplicity - Habit tracking should be simple and frictionless",
              "Privacy - Your data is yours, and we're committed to protecting it"
            ].map((item, i) => (
              <motion.li 
                key={i} 
                variants={itemAnimation}
                className="flex items-start"
              >
                <CheckCircle2 className="mr-3 size-5 text-habit-teal flex-shrink-0 mt-0.5" />
                <span>
                  <strong>{item.split(' - ')[0]}</strong> - {item.split(' - ')[1]}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          
          <motion.h2 variants={itemAnimation} className="mt-10 flex items-center">
            <span className="size-8 mr-3 rounded-full bg-habit-purple/10 flex items-center justify-center text-habit-purple">
              <span className="text-lg">3</span>
            </span>
            Our Team
          </motion.h2>
          
          <motion.div variants={itemAnimation}>
            <p>
              We're a small but dedicated team of developers, designers, and productivity enthusiasts
              working remotely across the globe. We're united by our passion for building tools that
              help people improve their lives through better habits.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemAnimation}
            className="mt-12 text-center"
            whileInView={{ 
              opacity: [0.5, 1], 
              y: [10, 0],
              transition: { duration: 0.5, delay: 0.2 }
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link to="/register">
                <Button className="bg-habit-purple hover:bg-habit-purple/90 group">
                  Start tracking your habits
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
