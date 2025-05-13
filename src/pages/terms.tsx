
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { fadeInUp, createStaggerContainer, itemAnimation } from '@/lib/utils';
import { 
  FileText, 
  BookOpen, 
  UserCheck, 
  FileSymlink, 
  Settings, 
  Shield, 
  Scale, 
  RefreshCw, 
  HelpCircle 
} from 'lucide-react';

const TermsPage = () => {
  const staggerContainer = createStaggerContainer(0.1, 0.1);
  
  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      icon: <BookOpen className="size-5 text-habit-purple" />,
      content: (
        <>
          <p className="mb-4">
            Welcome to HabitVault! These Terms of Service govern your use of our website and services.
            By accessing our website at <a href="https://habitvault.com" className="text-habit-purple hover:underline">https://habitvault.com</a>, you agree to these terms.
          </p>
          
          <div className="p-4 bg-gradient-to-r from-habit-purple/5 to-transparent border-l-4 border-habit-purple rounded-r-md my-4">
            <p className="text-sm">
              <strong>Important:</strong> Please read these terms carefully as they contain important information about your legal rights, remedies, and obligations.
            </p>
          </div>
        </>
      )
    },
    {
      id: 'definitions',
      title: '2. Definitions',
      icon: <FileText className="size-5 text-habit-teal" />,
      content: (
        <>
          <div className="space-y-2">
            <div className="flex">
              <strong className="min-w-28 inline-block">"Service"</strong>
              <span>refers to the HabitVault application, website, and related services.</span>
            </div>
            <div className="flex">
              <strong className="min-w-28 inline-block">"User"</strong>
              <span>refers to individuals who access or use the Service.</span>
            </div>
            <div className="flex">
              <strong className="min-w-28 inline-block">"Account"</strong>
              <span>refers to a registered account within the Service.</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'account',
      title: '3. Account Registration',
      icon: <UserCheck className="size-5 text-habit-purple" />,
      content: (
        <>
          <p className="mb-4">
            When you create an account with us, you must provide accurate and complete information.
            You are responsible for maintaining the security of your account and password.
          </p>
          
          <p>
            We cannot and will not be liable for any loss or damage from your failure to comply
            with this security obligation.
          </p>
        </>
      )
    },
    {
      id: 'content',
      title: '4. User Content',
      icon: <FileSymlink className="size-5 text-habit-teal" />,
      content: (
        <>
          <p className="mb-4">
            Our Service allows you to post, link, store, share and otherwise make available certain
            information, text, graphics, or other material.
          </p>
          
          <div className="mb-4 p-3 bg-muted rounded-md">
            <p className="font-medium">You retain any rights to any content you submit, post or display on or through the Service.</p>
          </div>
          
          <ul className="list-disc ml-5 space-y-1">
            <li>You are responsible for any content you post</li>
            <li>We may remove content that violates our policies</li>
            <li>We do not claim ownership of your content</li>
          </ul>
        </>
      )
    },
    {
      id: 'modifications',
      title: '5. Service Modifications',
      icon: <Settings className="size-5 text-habit-purple" />,
      content: (
        <>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently, the Service
            with or without notice. We shall not be liable to you or to any third party for any
            modification, suspension or discontinuance of the Service.
          </p>
        </>
      )
    },
    {
      id: 'liability',
      title: '6. Limitation Of Liability',
      icon: <Shield className="size-5 text-habit-teal" />,
      content: (
        <>
          <p>
            In no event shall HabitVault, nor its directors, employees, partners, agents, suppliers,
            or affiliates, be liable for any indirect, incidental, special, consequential or punitive
            damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
            losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </>
      )
    },
    {
      id: 'law',
      title: '7. Governing Law',
      icon: <Scale className="size-5 text-habit-purple" />,
      content: (
        <>
          <p>
            These Terms shall be governed and construed in accordance with the laws, without regard
            to its conflict of law provisions.
          </p>
        </>
      )
    },
    {
      id: 'changes',
      title: '8. Changes To Terms',
      icon: <RefreshCw className="size-5 text-habit-teal" />,
      content: (
        <>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
            It is your responsibility to review these Terms periodically for changes.
          </p>
        </>
      )
    },
    {
      id: 'contact',
      title: '9. Contact Us',
      icon: <HelpCircle className="size-5 text-habit-purple" />,
      content: (
        <>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            <a 
              href="mailto:legal@habitvault.com" 
              className="text-habit-purple hover:underline mt-2 inline-block"
            >
              legal@habitvault.com
            </a>
          </p>
        </>
      )
    }
  ];

  return (
    <div className="py-24">
      <div className="container px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: May 13, 2025</p>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 bg-gradient-to-r from-habit-teal to-habit-purple max-w-xs mx-auto mt-6"
          />
        </motion.div>

        {/* Quick Navigation - Jump to sections */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
          className="mb-12 bg-muted/30 p-6 rounded-xl border border-border/30"
        >
          <h2 className="text-xl font-semibold mb-4">Document Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a 
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center py-2 px-3 rounded-md hover:bg-background/50 transition-colors"
              >
                <span className="mr-2 opacity-70">{section.icon}</span>
                <span>{section.title}</span>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              variants={itemAnimation}
              custom={index}
              className="scroll-mt-24"
            >
              <Card className="overflow-hidden border-border/40">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-habit-teal/5 to-transparent border-b border-border/30 p-4 flex items-center">
                    <span className="p-2 rounded-full bg-background mr-3">
                      {section.icon}
                    </span>
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                  </div>
                  <div className="p-6 prose prose-sm dark:prose-invert">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-r from-habit-purple/10 to-habit-teal/10 rounded-xl p-6 mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="font-medium">By using HabitVault, you agree to these terms and conditions.</p>
          <p className="text-sm text-muted-foreground mt-2">Last revised: May 13, 2025</p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
