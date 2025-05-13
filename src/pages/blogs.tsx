
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { blogPosts } from '@/data/blog-posts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const BlogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [activeCategory, setActiveCategory] = useState('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  // Filter posts when search or category changes
  useEffect(() => {
    let result = blogPosts;
    
    // Apply category filter if not "All"
    if (activeCategory !== 'All') {
      result = result.filter(post => post.category === activeCategory);
    }
    
    // Apply search filter if there's a search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(lowerSearchTerm) ||
        post.excerpt.toLowerCase().includes(lowerSearchTerm) ||
        post.category.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    setFilteredPosts(result);
  }, [searchTerm, activeCategory]);

  return (
    <div className="py-24">
      <div className="container px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-6">HabitVault Blog</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
            Insights, tips, and stories about building better habits and achieving your goals
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search articles..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "transition-all",
                  activeCategory === category && "bg-habit-purple hover:bg-habit-purple/90"
                )}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                index={index}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 text-center">
              <p className="text-lg text-muted-foreground">No articles found matching your criteria.</p>
              <Button 
                variant="link" 
                onClick={() => { 
                  setSearchTerm('');
                  setActiveCategory('All');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface BlogCardProps {
  post: typeof blogPosts[0];
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
