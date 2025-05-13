
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '@/data/blog-posts';
import { Card, CardContent } from '@/components/ui/card';
import { scaleIn, fadeInUp } from '@/lib/utils';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  
  // Find the post in our blog posts data
  const post = blogPosts.find(p => p.id === postId) || {
    id: postId,
    title: "The Science Behind Habit Formation",
    content: `
      <p>Building new habits is a fundamental part of personal growth and development. But what exactly happens in our brains when we form new habits?</p>
      
      <h2>The Habit Loop</h2>
      <p>According to research by Charles Duhigg and others, habits consist of a three-part "habit loop": cue, routine, and reward.</p>
      
      <ul>
        <li><strong>Cue:</strong> The trigger that initiates the habit</li>
        <li><strong>Routine:</strong> The behavior itself</li>
        <li><strong>Reward:</strong> The benefit you get from doing the behavior</li>
      </ul>
      
      <p>Understanding this loop is crucial to forming new habits effectively.</p>
      
      <h2>The Role of Dopamine</h2>
      <p>When we complete a habit and receive a reward, our brain releases dopamine, a neurotransmitter associated with pleasure and satisfaction. Over time, this dopamine release becomes associated with the cue, creating anticipation and motivating us to perform the habit again.</p>
      
      <blockquote>Dopamine is not just about pleasure; it's about anticipating pleasure. This anticipation is what drives us to repeat behaviors.</blockquote>
      
      <h2>The Importance of Visual Tracking</h2>
      <p>Visual tracking tools like HabitVault leverage neurological principles to enhance habit formation. When you see your streak growing, it creates a visual reward that reinforces the behavior.</p>
      
      <p>Studies show that visual progress indicators can increase habit adherence by up to 40%, making them powerful tools for behavior change.</p>
      
      <h2>The 66-Day Myth</h2>
      <p>While popular wisdom suggests it takes 21 days to form a habit, research by Phillippa Lally at University College London suggests the actual average is closer to 66 days, with significant individual variation ranging from 18 to 254 days.</p>
      
      <div class="tip-box">
        <h4>Key Insight</h4>
        <p>The time it takes to form a habit varies widely between individuals. Don't get discouraged if it takes longer than expected – persistence is key!</p>
      </div>
      
      <h2>Applying The Science</h2>
      <p>To put this knowledge to work:</p>
      
      <ol>
        <li>Identify clear cues for your desired habits</li>
        <li>Make the routine as simple as possible initially</li>
        <li>Ensure the reward is meaningful to you</li>
        <li>Track your progress visually</li>
        <li>Be patient with yourself - habit formation takes time!</li>
      </ol>
      
      <div class="conclusion">
        <p>Understanding the science behind habit formation gives you a powerful advantage in building lasting positive behaviors. By leveraging tools like HabitVault that incorporate these principles, you can dramatically increase your chances of success.</p>
      </div>
    `,
    date: "May 10, 2025",
    author: {
      name: "Dr. Alex Johnson",
      avatar: "",
      title: "Neuroscientist & Habit Researcher"
    },
    readTime: "6 min read",
    category: "Science"
  };

  return (
    <div className="py-24">
      <div className="container px-4 max-w-4xl mx-auto">
        <Link to="/blogs">
          <Button variant="ghost" className="mb-8 group">
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to blogs
          </Button>
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <header className="mb-8">
            <motion.div 
              className="text-sm text-muted-foreground mb-2 flex items-center"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
            >
              <span className="bg-habit-purple/10 text-habit-purple px-3 py-1 rounded-full">{post.category}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime}</span>
            </motion.div>
            
            <motion.h1 
              className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              {post.title}
            </motion.h1>
            
            <motion.div 
              className="flex items-center space-x-4 border-b border-border/30 pb-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.3 }}
            >
              <Avatar className="h-12 w-12 border-2 border-habit-purple/20">
                <AvatarFallback className="bg-habit-purple/10 text-habit-purple">
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">{post.author.title}</div>
              </div>
              <div className="text-sm text-muted-foreground ml-auto">
                Published on {post.date}
              </div>
            </motion.div>
          </header>

          <motion.div 
            className="mb-12 h-64 bg-gradient-to-r from-habit-purple/20 to-habit-teal/20 rounded-xl flex items-center justify-center overflow-hidden relative"
            variants={scaleIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <div className="text-center z-10">
              <div className="size-16 bg-habit-purple/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-habit-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-lg font-medium">Featured Image</div>
            </div>
            
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-habit-purple/10 to-habit-teal/10"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
              }}
            />
          </motion.div>

          <motion.div 
            className="prose prose-lg dark:prose-invert max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            dangerouslySetInnerHTML={{ 
              __html: post.content
                .replace(
                  /<blockquote>(.*?)<\/blockquote>/gs, 
                  '<blockquote class="p-4 my-6 border-l-4 border-habit-purple bg-habit-purple/5 rounded-r-lg"><p class="italic text-lg">$1</p></blockquote>'
                )
                .replace(
                  /<div class="tip-box">(.*?)<\/div>/gs,
                  '<div class="bg-habit-teal/10 border border-habit-teal/20 rounded-lg p-4 my-6">$1</div>'
                )
                .replace(
                  /<div class="conclusion">(.*?)<\/div>/gs,
                  '<div class="bg-gradient-to-r from-habit-purple/10 to-habit-teal/10 border border-habit-teal/20 rounded-lg p-6 my-8">$1</div>'
                )
            }}
          />
          
          {/* Related Articles Section */}
          <motion.div
            className="border-t border-border/30 pt-10 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="text-sm text-muted-foreground mb-2">Psychology</div>
                    <h4 className="text-lg font-bold mb-2">How to Break Bad Habits Effectively</h4>
                    <p className="text-muted-foreground line-clamp-2">
                      Discover science-backed techniques to break unwanted habits and replace them with positive behaviors.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="text-sm text-muted-foreground mb-2">Productivity</div>
                    <h4 className="text-lg font-bold mb-2">Morning Routines of Successful People</h4>
                    <p className="text-muted-foreground line-clamp-2">
                      Learn how successful entrepreneurs and leaders structure their mornings for maximum productivity.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          
          {/* Newsletter Sign-up */}
          <motion.div
            className="bg-gradient-to-r from-habit-purple/10 to-habit-teal/10 rounded-xl p-8 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="text-center">
              <h4 className="text-xl font-bold mb-2">Enjoy this article?</h4>
              <p className="mb-4">Subscribe to our newsletter for weekly insights on habit formation and productivity.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="ghost" className="bg-white/10 backdrop-blur-sm hover:bg-white/20">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPostPage;
