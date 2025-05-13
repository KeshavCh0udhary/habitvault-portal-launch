
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const BlogsPage = () => {
  return (
    <div className="py-24">
      <div className="container px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6">HabitVault Blog</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Insights, tips, and stories about building better habits and achieving your goals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Science Behind Habit Formation",
    excerpt: "Discover the neuroscience of how habits form and why visual tracking is so effective.",
    date: "May 10, 2025",
    author: {
      name: "Dr. Alex Johnson",
      avatar: "",
    },
    category: "Science",
    image: "",
  },
  {
    id: 2,
    title: "5 Morning Habits That Boost Productivity",
    excerpt: "Learn which morning habits can set you up for a successful and productive day.",
    date: "May 8, 2025",
    author: {
      name: "Maria Santos",
      avatar: "",
    },
    category: "Productivity",
    image: "",
  },
  {
    id: 3,
    title: "How to Build a Meditation Habit That Sticks",
    excerpt: "A step-by-step guide to incorporating meditation into your daily routine.",
    date: "May 5, 2025",
    author: {
      name: "David Chen",
      avatar: "",
    },
    category: "Wellness",
    image: "",
  },
  {
    id: 4,
    title: "Breaking Bad Habits: A Strategic Approach",
    excerpt: "Effective strategies for identifying and breaking habits that don't serve you.",
    date: "May 3, 2025",
    author: {
      name: "Lisa Williams",
      avatar: "",
    },
    category: "Self-improvement",
    image: "",
  },
  {
    id: 5,
    title: "The Power of Habit Stacking for Behavior Change",
    excerpt: "How to use the habit stacking technique to build multiple good habits at once.",
    date: "April 30, 2025",
    author: {
      name: "James Taylor",
      avatar: "",
    },
    category: "Productivity",
    image: "",
  },
  {
    id: 6,
    title: "Visual Habit Tracking: Why It Works So Well",
    excerpt: "The psychological benefits of seeing your progress visually represented.",
    date: "April 25, 2025",
    author: {
      name: "Dr. Sarah Parker",
      avatar: "",
    },
    category: "Psychology",
    image: "",
  },
];

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

const BlogCard = ({ post, index }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <Link to={`/blogs/${post.id}`} className="block h-full">
        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
          <div className={`h-32 bg-gradient-to-r ${index % 3 === 0 ? 'from-habit-purple/20 to-habit-purple/10' : index % 3 === 1 ? 'from-habit-teal/20 to-habit-teal/10' : 'from-habit-purple/10 to-habit-teal/10'}`} />
          <CardHeader className="pb-2">
            <CardTitle className="line-clamp-2 text-xl">{post.title}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{post.category}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="line-clamp-3">
              {post.excerpt}
            </CardDescription>
          </CardContent>
          <CardFooter className="border-t border-border pt-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">{post.author.name}</div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default BlogsPage;
