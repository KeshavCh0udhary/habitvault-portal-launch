
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { EnhancedCursorGradient } from '@/components/enhanced-cursor-gradient';
import { Logo } from '@/components/logo';
import { ChevronRight, ArrowRight, CheckCircle2, TrendingUp, Calendar, Target } from 'lucide-react';
import { 
  fadeInUp, 
  fadeIn, 
  scaleIn, 
  createStaggerContainer, 
  itemAnimation, 
  gradientMovement 
} from '@/lib/utils';

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
  const heroRotate = useTransform(scrollYProgress, [0, 0.1], [0, -2]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section with enhanced animation */}
      <EnhancedCursorGradient 
        className="min-h-screen flex items-center pt-16" 
        intensity="high"
        particleCount={40}
      >
        <div ref={heroRef} className="container px-4 mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            style={{ 
              opacity: opacityHero, 
              y: yHero,
              rotateX: heroRotate,
              scale: heroScale,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2 
              }}
              className="mx-auto mb-8"
              whileHover={{ 
                rotate: [0, -5, 5, 0], 
                transition: { duration: 0.5 }
              }}
            >
              <Logo variant="large" showText={false} />
            </motion.div>
            
            {/* Improved hero content structure with better typography */}
            <motion.div className="space-y-6">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
                transition={{ duration: 0.6 }}
              >
                Transform Your Daily 
                <br className="hidden md:block" />
                <motion.span 
                  className="text-gradient inline-block" 
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                  variants={gradientMovement}
                  initial="initial"
                  animate="animate"
                >
                  Habits Into Results
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Build consistent routines, visualize your progress, and achieve your goals with our powerful habit tracking system.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="group bg-habit-purple hover:bg-habit-purple/90 rounded-full h-14 px-8 text-lg relative overflow-hidden"
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
                    Start Tracking Free
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="outline"
                    className="rounded-full h-14 px-8 text-lg border-2 hover:bg-background/5"
                    onClick={() => navigate('/login')}
                  >
                    See How It Works
                  </Button>
                </motion.div>
              </motion.div>

              {/* Social proof section */}
              <motion.div
                className="pt-8 flex justify-center items-center gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: heroInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-habit-purple">10k+</span>
                  <span className="text-sm text-foreground/60">Active Users</span>
                </div>
                <div className="h-8 border-r border-border/40"></div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-habit-teal">92%</span>
                  <span className="text-sm text-foreground/60">Success Rate</span>
                </div>
                <div className="h-8 border-r border-border/40 hidden md:block"></div>
                <div className="flex flex-col items-center hidden md:flex">
                  <span className="text-3xl font-bold text-habit-purple">4.8/5</span>
                  <span className="text-sm text-foreground/60">User Rating</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-16 mb-8 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: heroInView ? 1 : 0, scale: heroInView ? 1 : 0.95 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
                transition: { duration: 0.2 }
              }}
            >
              <div className="relative mx-auto max-w-3xl rounded-2xl shadow-xl overflow-hidden border border-border/30">
                <div className="bg-black/5 dark:bg-white/5 h-8 flex items-center px-4 border-b border-border/30">
                  <div className="flex space-x-2">
                    <motion.div 
                      className="size-3 rounded-full bg-red-400"
                      whileHover={{ scale: 1.2 }}
                    />
                    <motion.div 
                      className="size-3 rounded-full bg-yellow-400"
                      whileHover={{ scale: 1.2 }}
                    />
                    <motion.div 
                      className="size-3 rounded-full bg-green-400"
                      whileHover={{ scale: 1.2 }}
                    />
                  </div>
                </div>
                <div className="aspect-video bg-muted/30 flex justify-center items-center">
                  <motion.div 
                    className="text-center p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.div 
                      className="size-16 bg-habit-purple/20 rounded-full flex items-center justify-center mx-auto mb-4"
                      animate={{ 
                        boxShadow: [
                          "0 0 0 rgba(108, 93, 211, 0)",
                          "0 0 20px rgba(108, 93, 211, 0.5)",
                          "0 0 0 rgba(108, 93, 211, 0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Calendar className="size-8 text-habit-purple" />
                    </motion.div>
                    <p className="text-lg font-medium">HabitVault Dashboard Preview</p>
                    <p className="text-sm text-foreground/60 mt-1">Sign up to start tracking your habits</p>
                  </motion.div>
                </div>
              </div>
              
              {/* Decorative elements with subtle animations */}
              <motion.div 
                className="absolute -z-10 size-64 rounded-full bg-habit-purple/10 blur-3xl -top-10 -left-10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute -z-10 size-64 rounded-full bg-habit-teal/10 blur-3xl -bottom-10 -right-10"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0.9, 0.6],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </EnhancedCursorGradient>

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
              <motion.ul 
                className="space-y-4"
                variants={createStaggerContainer()}
                initial="hidden"
                animate={statsInView ? "show" : "hidden"}
              >
                {[
                  "Track daily, weekly, and monthly progress",
                  "Visualize habit streaks and consistency",
                  "Get insights on best times and patterns",
                  "Set custom goals and receive reminders"
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-start"
                    variants={itemAnimation}
                  >
                    <CheckCircle2 className="mr-3 size-5 text-habit-teal flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
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
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="bg-card rounded-xl border border-border/40 p-6 shadow-lg bg-gradient-card"
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
                <motion.div 
                  className="grid grid-cols-3 gap-4 pt-4 border-t border-border"
                  variants={createStaggerContainer(0.1, 0.8)}
                  initial="hidden"
                  animate={statsInView ? "show" : "hidden"}
                >
                  {[
                    { label: "Streak", value: "16 days" },
                    { label: "Completion", value: "92%" },
                    { label: "Habits", value: "8 active" }
                  ].map((stat) => (
                    <motion.div 
                      key={stat.label} 
                      className="text-center"
                      variants={itemAnimation}
                    >
                      <p className="text-foreground/60 text-sm">{stat.label}</p>
                      <p className="font-semibold">{stat.value}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
              
              {/* Decorative elements */}
              <motion.div 
                className="absolute -z-10 size-64 rounded-full bg-habit-purple/5 blur-3xl -top-10 -right-10"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section with enhanced animations */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              Ready to transform your habits?
            </motion.h2>
            <motion.p 
              className="text-lg text-foreground/70 mb-8 max-w-xl mx-auto"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of users who have successfully built lasting habits using HabitVault's visual tracking system.
            </motion.p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
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
            <motion.p 
              className="text-sm text-foreground/50 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              No credit card required. Free plan available.
            </motion.p>
          </motion.div>
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
      className="bg-card border border-border/40 rounded-xl p-6 shadow-sm bg-gradient-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -8, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 }
      }}
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
