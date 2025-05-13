
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();

  // In a real app, you would fetch the blog post data based on the ID
  // For now, we'll use dummy content
  const post = {
    id: Number(id),
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
      
      <h2>The Importance of Visual Tracking</h2>
      <p>Visual tracking tools like HabitVault leverage neurological principles to enhance habit formation. When you see your streak growing, it creates a visual reward that reinforces the behavior.</p>
      
      <p>Studies show that visual progress indicators can increase habit adherence by up to 40%, making them powerful tools for behavior change.</p>
      
      <h2>The 66-Day Myth</h2>
      <p>While popular wisdom suggests it takes 21 days to form a habit, research by Phillippa Lally at University College London suggests the actual average is closer to 66 days, with significant individual variation ranging from 18 to 254 days.</p>
      
      <p>This highlights the importance of persistence and why tools that provide ongoing motivation are so valuable.</p>
      
      <h2>Applying The Science</h2>
      <p>To put this knowledge to work:</p>
      
      <ol>
        <li>Identify clear cues for your desired habits</li>
        <li>Make the routine as simple as possible initially</li>
        <li>Ensure the reward is meaningful to you</li>
        <li>Track your progress visually</li>
        <li>Be patient with yourself - habit formation takes time!</li>
      </ol>
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
          <Button variant="ghost" className="mb-8">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to blogs
          </Button>
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-8">
            <div className="text-sm text-muted-foreground mb-2 flex items-center">
              <span>{post.category}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">{post.author.title}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                Published on {post.date}
              </div>
            </div>
          </header>

          <div className="mb-12 h-64 bg-gradient-to-r from-habit-purple/20 to-habit-teal/20 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="size-16 bg-habit-purple/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-habit-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-lg font-medium">Featured Image</div>
            </div>
          </div>

          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPostPage;
