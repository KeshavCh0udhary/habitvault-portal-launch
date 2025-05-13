
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { EnhancedCursorGradient } from '@/components/enhanced-cursor-gradient';
import { Logo } from '@/components/logo';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  ChevronRight, ArrowRight, CheckCircle2, TrendingUp, Calendar, 
  Target, Star, Heart, BookOpen, AlertTriangle, Shield, User, Award
} from 'lucide-react';
import { 
  fadeInUp, fadeIn, scaleIn, createStaggerContainer, 
  itemAnimation, gradientMovement, slideInRight, slideInLeft, 
  staggerContainer, childStagger, parentStagger
} from '@/lib/utils';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('hero');
  
  // Refs for all sections for intersection observer
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Intersection observers for animations
  const heroInView = useInView(heroRef, { once: false, amount: 0.5 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.3 });
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.3 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 });
  
  const { scrollYProgress } = useScroll();
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Update the active section based on scroll position
    if (latest < 0.2) setActiveSection('hero');
    else if (latest < 0.4) setActiveSection('features');
    else if (latest < 0.6) setActiveSection('how-it-works');
    else if (latest < 0.8) setActiveSection('benefits');
    else setActiveSection('cta');
  });
  
  // Parallax and other scroll-based animations
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 50]);
  const heroRotate = useTransform(scrollYProgress, [0, 0.1], [0, -2]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  // Blob animation values
  const blobX1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const blobX2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, -70]);
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section with enhanced animation */}
      <EnhancedCursorGradient 
        className="min-h-screen flex items-center pt-16 relative overflow-hidden" 
        intensity="high"
        particleCount={40}
      >
        {/* Animated background blobs */}
        <motion.div 
          className="hero-blob hero-blob-1"
          style={{ x: blobX1, y: blobY1 }}
        />
        <motion.div 
          className="hero-blob hero-blob-2"
          style={{ x: blobX2, y: blobY2 }}
        />
        <motion.div className="hero-blob hero-blob-3" />
        
        <div ref={heroRef} className="container px-4 mx-auto relative z-10">
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
              <Logo variant="large" showText />
            </motion.div>
            
            {/* Enhanced hero content with more appealing typography */}
            <motion.div className="space-y-8">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
                transition={{ duration: 0.7, type: "spring" }}
              >
                Build Better Habits,<br className="hidden md:block" />
                <motion.span 
                  className="text-gradient inline-block" 
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                  variants={gradientMovement}
                  initial="initial"
                  animate="animate"
                >
                  Achieve Your Goals
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                HabitVault helps you track, visualize, and maintain consistent routines 
                that transform your daily habits into measurable success.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
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
                    Start Free, No Login Required
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
                    onClick={() => {
                      const featuresElement = featuresRef.current;
                      if (featuresElement) {
                        featuresElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Explore Features
                  </Button>
                </motion.div>
              </motion.div>

              {/* Enhanced social proof section */}
              <motion.div
                className="pt-12 flex flex-wrap justify-center items-center gap-8 md:gap-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: heroInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-bold text-habit-purple">10k+</span>
                  <span className="text-sm md:text-base text-foreground/60">Active Users</span>
                </div>
                <div className="h-10 border-r border-border/40 hidden sm:block"></div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-bold text-habit-teal">92%</span>
                  <span className="text-sm md:text-base text-foreground/60">Success Rate</span>
                </div>
                <div className="h-10 border-r border-border/40 hidden sm:block"></div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-bold text-habit-purple">4.8/5</span>
                  <span className="text-sm md:text-base text-foreground/60">User Rating</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-16 mb-8 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: heroInView ? 1 : 0, scale: heroInView ? 1 : 0.95 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
                transition: { duration: 0.2 }
              }}
            >
              <div className="relative mx-auto max-w-4xl rounded-2xl shadow-xl overflow-hidden border border-border/30">
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
                <div className="bg-muted/10 backdrop-blur-sm">
                  <AspectRatio ratio={16/9}>
                    <div className="w-full h-full flex justify-center items-center bg-gradient-to-br from-habit-purple/5 to-habit-teal/5">
                      <motion.div 
                        className="text-center p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <motion.div 
                          className="size-24 bg-habit-purple/10 rounded-full flex items-center justify-center mx-auto mb-6"
                          animate={{ 
                            boxShadow: [
                              "0 0 0 rgba(108, 93, 211, 0)",
                              "0 0 20px rgba(108, 93, 211, 0.5)",
                              "0 0 0 rgba(108, 93, 211, 0)"
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Calendar className="size-12 text-habit-purple" />
                        </motion.div>
                        <h3 className="text-2xl font-semibold mb-3">Your Habit Journey Awaits</h3>
                        <p className="text-foreground/70 max-w-md mx-auto">
                          Track your progress, visualize your success, and build lasting habits with HabitVault's intuitive dashboard.
                        </p>
                      </motion.div>
                    </div>
                  </AspectRatio>
                </div>
              </div>
              
              {/* Enhanced decorative elements */}
              <motion.div 
                className="absolute -z-10 size-80 rounded-full bg-habit-purple/10 blur-3xl -top-20 -left-20"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute -z-10 size-80 rounded-full bg-habit-teal/10 blur-3xl -bottom-20 -right-20"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </EnhancedCursorGradient>

      {/* Features Section - Redesigned */}
      <section ref={featuresRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-habit-purple/5 to-habit-teal/5 z-0" />
        
        <div className="container px-4 mx-auto relative z-10">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: featuresInView ? 1 : 0, y: featuresInView ? 0 : 30 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="inline-block mb-3 px-4 py-1 rounded-full bg-habit-purple/10 text-habit-purple text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: featuresInView ? 1 : 0, scale: featuresInView ? 1 : 0.9 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Powerful Features
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold mb-5">
              Everything You Need to <span className="text-gradient">Build Better Habits</span>
            </h2>
            <p className="text-foreground/70 text-lg md:text-xl">
              HabitVault combines beautiful visualizations with proven habit-building science to help you achieve your goals.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={createStaggerContainer(0.15, 0.3)}
            initial="hidden"
            animate={featuresInView ? "show" : "hidden"}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section - New */}
      <section ref={howItWorksRef} className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: howItWorksInView ? 1 : 0, y: howItWorksInView ? 0 : 30 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="inline-block mb-3 px-4 py-1 rounded-full bg-habit-teal/10 text-habit-teal text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: howItWorksInView ? 1 : 0, scale: howItWorksInView ? 1 : 0.9 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Simple Process
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold mb-5">
              How <span className="text-gradient">HabitVault</span> Works
            </h2>
            <p className="text-foreground/70 text-lg md:text-xl">
              Getting started is easy. Follow these simple steps to transform your habits and reach your goals.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-6 md:gap-12 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate={howItWorksInView ? "animate" : "initial"}
          >
            {steps.map((step, index) => (
              <StepCard
                key={step.title}
                number={index + 1}
                title={step.title}
                description={step.description}
                icon={step.icon}
                delay={index * 0.2}
              />
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Benefits Section - New with alternating layout */}
      <section ref={benefitsRef} className="py-24 relative overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: benefitsInView ? 1 : 0, y: benefitsInView ? 0 : 30 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="inline-block mb-3 px-4 py-1 rounded-full bg-habit-purple/10 text-habit-purple text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: benefitsInView ? 1 : 0, scale: benefitsInView ? 1 : 0.9 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Real Results
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold mb-5">
              Transform Your <span className="text-gradient">Daily Life</span>
            </h2>
            <p className="text-foreground/70 text-lg md:text-xl">
              Experience powerful benefits that help you build consistency and achieve meaningful results.
            </p>
          </motion.div>
          
          <div className="space-y-24 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                initial="initial"
                animate={benefitsInView ? "animate" : "initial"}
                variants={{ 
                  initial: { opacity: 0 },
                  animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
                }}
              >
                <motion.div
                  variants={index % 2 === 0 ? slideInRight : slideInLeft}
                >
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${benefit.gradient} h-full flex items-center justify-center`}>
                    <div className="aspect-square w-full max-w-sm mx-auto rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center p-8">
                      <div className="text-center">
                        {benefit.icon}
                        <h3 className="text-2xl font-semibold mt-6 mb-4">{benefit.visualTitle}</h3>
                        <p className="text-white/70">{benefit.visualText}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  variants={index % 2 === 0 ? slideInLeft : slideInRight}
                  className="flex flex-col"
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-foreground/70 text-lg mb-6">{benefit.description}</p>
                  
                  <motion.ul 
                    className="space-y-4"
                    variants={parentStagger}
                  >
                    {benefit.points.map((point, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-start"
                        variants={childStagger}
                      >
                        <CheckCircle2 className="mr-3 size-5 text-habit-teal flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section - New */}
      <section ref={testimonialsRef} className="py-24 bg-muted/30 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-habit-purple/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-80 h-80 bg-habit-teal/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        <div className="container px-4 mx-auto relative z-10">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: testimonialsInView ? 1 : 0, y: testimonialsInView ? 0 : 30 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="inline-block mb-3 px-4 py-1 rounded-full bg-habit-teal/10 text-habit-teal text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: testimonialsInView ? 1 : 0, scale: testimonialsInView ? 1 : 0.9 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Success Stories
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold mb-5">
              What Our Users <span className="text-gradient">Say</span>
            </h2>
            <p className="text-foreground/70 text-lg md:text-xl">
              Join thousands of users who have transformed their habits and achieved their goals.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={createStaggerContainer(0.1, 0.3)}
            initial="hidden"
            animate={testimonialsInView ? "show" : "hidden"}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={itemAnimation}
                className="testimonial-card"
              >
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className="w-5 h-5 text-yellow-500 fill-yellow-500" 
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="mb-4 text-lg">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="size-12 rounded-full bg-habit-purple/20 flex items-center justify-center text-habit-purple font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-foreground/60">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section - Enhanced */}
      <section ref={ctaRef} className="py-24 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-habit-purple/10 to-habit-teal/10"
          variants={gradientMovement}
          initial="initial"
          animate="animate"
        />
        
        <div className="container px-4 mx-auto relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center p-8 md:p-12 rounded-2xl border border-white/10 bg-black/5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: ctaInView ? 1 : 0, y: ctaInView ? 0 : 30, scale: ctaInView ? 1 : 0.95 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6"
              variants={fadeIn}
              initial="initial"
              animate={ctaInView ? "animate" : "initial"}
            >
              Ready to transform your habits?
            </motion.h2>
            <motion.p 
              className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
              initial="initial"
              animate={ctaInView ? "animate" : "initial"}
              transition={{ delay: 0.2 }}
            >
              Join thousands of users who have successfully built lasting habits using HabitVault's visual tracking system. Start for free today!
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
              initial="initial"
              animate={ctaInView ? "animate" : "initial"}
              transition={{ delay: 0.4 }}
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
                  <ChevronRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline"
                  className="rounded-full h-12 px-6 text-base border border-white/20 bg-white/5 hover:bg-white/10"
                  onClick={() => navigate('/login')}
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
            <motion.p 
              className="text-sm text-foreground/50 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: ctaInView ? 1 : 0 }}
              transition={{ delay: 0.6 }}
            >
              No credit card required. Free plan available forever.
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
  color: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, color, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div 
      className="feature-card h-full"
      variants={itemAnimation}
      whileHover={{ 
        y: -10, 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
    >
      <motion.div 
        className={`size-16 ${color} rounded-2xl flex items-center justify-center mb-6`}
        whileHover={{ 
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.5 } 
        }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </motion.div>
  );
};

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const StepCard = ({ number, title, description, icon, delay = 0 }: StepCardProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center"
      variants={childStagger}
    >
      <motion.div 
        className="size-20 bg-habit-purple/10 rounded-full flex items-center justify-center mb-6 relative"
        whileHover={{ scale: 1.1 }}
      >
        <span className="absolute -top-2 -right-2 size-8 bg-habit-purple rounded-full text-white flex items-center justify-center font-bold">
          {number}
        </span>
        <div className="text-habit-purple">
          {icon}
        </div>
      </motion.div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </motion.div>
  );
};

// Data for features section
const features = [
  {
    icon: <Calendar className="size-8" />,
    title: "Visual Streak Calendar",
    description: "See your progress at a glance with our beautiful visual calendar that builds motivation through streak visualization.",
    color: "bg-habit-purple/10 text-habit-purple"
  },
  {
    icon: <TrendingUp className="size-8" />,
    title: "Progress Analytics",
    description: "Gain insights into your habit patterns with comprehensive analytics and visual progress reports.",
    color: "bg-habit-teal/10 text-habit-teal"
  },
  {
    icon: <Target className="size-8" />,
    title: "Smart Goal Setting",
    description: "Set specific, achievable goals and track your progress toward them with intelligent milestone tracking.",
    color: "bg-habit-purple/10 text-habit-purple"
  },
  {
    icon: <BookOpen className="size-8" />,
    title: "Habit Journal",
    description: "Document your journey with notes and reflections to understand what works best for you.",
    color: "bg-habit-teal/10 text-habit-teal"
  },
  {
    icon: <Heart className="size-8" />,
    title: "Wellness Integration",
    description: "Connect physical, mental, and emotional well-being habits for a holistic approach to self-improvement.",
    color: "bg-habit-purple/10 text-habit-purple"
  },
  {
    icon: <Award className="size-8" />,
    title: "Achievement System",
    description: "Earn badges and rewards that celebrate your consistency and progress milestones.",
    color: "bg-habit-teal/10 text-habit-teal"
  }
];

// Data for how it works section
const steps = [
  {
    title: "Create Your Habits",
    description: "Define the habits you want to build, customize frequency and set your goals.",
    icon: <Target className="size-7" />
  },
  {
    title: "Track Daily Progress",
    description: "Check in daily with a simple tap to mark your habits as complete.",
    icon: <CheckCircle2 className="size-7" />
  },
  {
    title: "Visualize & Improve",
    description: "See your progress, analyze patterns, and optimize your routine.",
    icon: <TrendingUp className="size-7" />
  }
];

// Data for benefits section
const benefits = [
  {
    title: "Build Lasting Consistency",
    description: "HabitVault helps you transform occasional actions into consistent daily habits that stick.",
    points: [
      "Visual cues reinforce daily habit completion",
      "Streak counting builds psychological momentum",
      "Pattern analysis helps identify optimal times"
    ],
    gradient: "from-habit-purple to-habit-purple/60",
    icon: <Calendar className="size-16 text-white" />,
    visualTitle: "Streak Calendar",
    visualText: "Watch your consistency grow day by day with visual streak tracking"
  },
  {
    title: "Stay Motivated Longer",
    description: "Our scientifically-designed system helps maintain motivation even when willpower is low.",
    points: [
      "Achievement badges celebrate milestones",
      "Progress visualization shows your journey",
      "Community support keeps you accountable"
    ],
    gradient: "from-habit-teal to-habit-teal/60",
    icon: <TrendingUp className="size-16 text-white" />,
    visualTitle: "Progress Trends",
    visualText: "See your improvement over time with intuitive analytics"
  },
  {
    title: "Achieve Multiple Goals",
    description: "Track various habits simultaneously and build a comprehensive system for success.",
    points: [
      "Organize habits by category or life area",
      "Balance different aspects of personal growth",
      "See how habits interconnect for better results"
    ],
    gradient: "from-habit-purple to-habit-purple/60",
    icon: <Target className="size-16 text-white" />,
    visualTitle: "Goal Dashboard",
    visualText: "Manage multiple goals in one centralized dashboard"
  }
];

// Data for testimonials section
const testimonials = [
  {
    name: "Sarah J.",
    title: "Fitness Coach",
    quote: "HabitVault has transformed how I build habits. The visual calendar makes it so satisfying to maintain streaks, and I've been meditating daily for 6 months now!"
  },
  {
    name: "Michael T.",
    title: "Software Developer",
    quote: "As someone who struggles with consistency, this app has been a game-changer. The analytics help me understand my patterns and improve continuously."
  },
  {
    name: "Priya K.",
    title: "Marketing Manager",
    quote: "I've tried many habit trackers, but HabitVault's beautiful design and thoughtful features keep me coming back. I've built 5 new healthy habits in just 3 months!"
  },
  {
    name: "David L.",
    title: "Graduate Student",
    quote: "The streak visualization genuinely motivates me. I've maintained a daily reading habit for over 100 days, which I never managed before using HabitVault."
  },
  {
    name: "Emma R.",
    title: "Healthcare Professional",
    quote: "This app helped me balance work, study, and self-care habits. The interface is intuitive and the progress reports are incredibly motivating."
  },
  {
    name: "James W.",
    title: "Entrepreneur",
    quote: "As a business owner with a chaotic schedule, HabitVault helps me maintain structure. The insights from tracking my habits have been invaluable."
  }
];

export default HomePage;
