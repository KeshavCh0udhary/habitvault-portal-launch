
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import CursorGradient from '@/components/cursor-gradient';
import { Logo } from '@/components/logo';
import { ChevronRight, ArrowRight, CheckCircle2, TrendingUp, Calendar, Target } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const heroInView = useInView(heroRef, { once: false, amount: 0.5 });
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  
  const { scrollYProgress } = useScroll();
  
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 50]);
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <CursorGradient className="min-h-screen flex items-center pt-16" intensity="high">
        <div ref={heroRef} className="container px-4 mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            style={{ opacity: opacityHero, y: yHero }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mb-8"
            >
              <Logo variant="large" showText={false} />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.6 }}
            >
              Build lasting habits with
              <br />
              <span className="text-gradient">visual streak tracking</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Track your daily habits effectively, visualize your progress,
              and build momentum with HabitVault's intuitive habit tracking system.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="group bg-habit-purple hover:bg-habit-purple/90 rounded-full h-12 px-6 text-base relative overflow-hidden"
                  onClick={() => navigate('/register')}
                >
                  <motion.span 
                    className="absolute inset-0 bg-white/20 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ 
                      scale: 1.5, 
                      opacity: 0.3,
                      transition: { repeat: Infinity, duration: 1.5 }
                    }}
                  />
                  Get Started Free
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline"
                  className="rounded-full h-12 px-6 text-base"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-12 mb-8 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: heroInView ? 1 : 0, scale: heroInView ? 1 : 0.95 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="relative mx-auto max-w-3xl rounded-2xl shadow-xl overflow-hidden border border-border/30">
                <div className="bg-black/5 dark:bg-white/5 h-8 flex items-center px-4 border-b border-border/30">
                  <div className="flex space-x-2">
                    <div className="size-3 rounded-full bg-red-400" />
                    <div className="size-3 rounded-full bg-yellow-400" />
                    <div className="size-3 rounded-full bg-green-400" />
                  </div>
                </div>
                <div className="aspect-video bg-muted/30 flex justify-center items-center">
                  <div className="text-center p-6">
                    <div className="size-16 bg-habit-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="size-8 text-habit-purple" />
                    </div>
                    <p className="text-lg font-medium">HabitVault Dashboard Preview</p>
                    <p className="text-sm text-foreground/60 mt-1">Sign up to start tracking your habits</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 size-64 rounded-full bg-habit-purple/10 blur-3xl -top-10 -left-10" />
              <div className="absolute -z-10 size-64 rounded-full bg-habit-teal/10 blur-3xl -bottom-10 -right-10" />
            </motion.div>
          </motion.div>
        </div>
      </CursorGradient>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="text-center max-w-xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: featuresInView ? 1 : 0, y: featuresInView ? 0 : 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Habits, <span className="text-gradient">Visualized</span>
            </h2>
            <p className="text-foreground/70 text-lg">
              HabitVault makes habit tracking simple, visual, and effective with features designed to keep you motivated.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                inView={featuresInView}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section ref={statsRef} className="py-24">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: statsInView ? 1 : 0, x: statsInView ? 0 : -50 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Achieve your goals with data-driven insights
              </h2>
              <p className="text-foreground/70 text-lg mb-8">
                HabitVault provides detailed analytics to help you understand your habit patterns
                and optimize your daily routine for maximum effectiveness.
              </p>
              <ul className="space-y-4">
                {[
                  "Track daily, weekly, and monthly progress",
                  "Visualize habit streaks and consistency",
                  "Get insights on best times and patterns",
                  "Set custom goals and receive reminders"
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: statsInView ? 1 : 0, x: statsInView ? 0 : -20 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  >
                    <CheckCircle2 className="mr-3 size-5 text-habit-teal flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="group"
                    onClick={() => navigate('/register')}
                  >
                    Start Tracking
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: statsInView ? 1 : 0, scale: statsInView ? 1 : 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="bg-card rounded-xl border border-border/40 p-6 shadow-lg"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-2 size-5 text-habit-teal" />
                  Habit Progress
                </h3>
                <div className="space-y-6 mb-6">
                  {['Morning Meditation', 'Exercise', 'Reading'].map((habit, i) => (
                    <div key={habit} className="space-y-2">
                      <div className="flex justify-between">
                        <span>{habit}</span>
                        <span className="text-habit-purple font-medium">{85 - i * 15}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-habit-purple to-habit-teal"
                          initial={{ width: "0%" }}
                          animate={{ width: statsInView ? `${85 - i * 15}%` : "0%" }}
                          transition={{ duration: 1, delay: 0.4 + i * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  {[
                    { label: "Streak", value: "16 days" },
                    { label: "Completion", value: "92%" },
                    { label: "Habits", value: "8 active" }
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-foreground/60 text-sm">{stat.label}</p>
                      <p className="font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 size-64 rounded-full bg-habit-purple/5 blur-3xl -top-10 -right-10" />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to transform your habits?
              </h2>
              <p className="text-lg text-foreground/70 mb-8 max-w-xl mx-auto">
                Join thousands of users who have successfully built lasting habits using HabitVault's visual tracking system.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button 
                  className="group bg-habit-purple hover:bg-habit-purple/90 rounded-full h-12 px-6 text-base relative overflow-hidden"
                  onClick={() => navigate('/register')}
                >
                  <motion.span 
                    className="absolute inset-0 bg-white/20 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ 
                      scale: 1.5, 
                      opacity: 0.3,
                      transition: { repeat: Infinity, duration: 1.5 }
                    }}
                  />
                  Get Started Free
                  <ChevronRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
              <p className="text-sm text-foreground/50 mt-4">
                No credit card required. Free plan available.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  inView: boolean;
  delay: number;
}

const FeatureCard = ({ icon, title, description, inView, delay }: FeatureCardProps) => {
  return (
    <motion.div 
      className="bg-card border border-border/40 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div 
        className="size-12 bg-habit-purple/10 rounded-lg flex items-center justify-center mb-4 text-habit-purple"
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          transition: { duration: 0.2 } 
        }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </motion.div>
  );
};

const features = [
  {
    icon: <Calendar className="size-6" />,
    title: "Visual Streaks",
    description: "See your progress with beautiful visual representations of your habit streaks."
  },
  {
    icon: <TrendingUp className="size-6" />,
    title: "Progress Analytics",
    description: "Gain insights into your habit patterns with detailed analytics and reports."
  },
  {
    icon: <Target className="size-6" />,
    title: "Goal Setting",
    description: "Set specific goals and track your progress toward achieving them over time."
  }
];

export default HomePage;
