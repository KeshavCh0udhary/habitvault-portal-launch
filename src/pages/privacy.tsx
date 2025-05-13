
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { fadeInUp, createStaggerContainer, itemAnimation } from '@/lib/utils';
import { Shield, Eye, Lock, Trash2, FileCheck, RefreshCw, Bell, HelpCircle } from 'lucide-react';

const PrivacyPage = () => {
  const staggerContainer = createStaggerContainer(0.1, 0.1);
  
  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      icon: <Shield className="size-5 text-habit-purple" />,
      content: (
        <>
          <p className="mb-4">
            Your privacy is important to us. It is HabitVault's policy to respect your privacy and comply with any applicable law and regulation regarding any personal information we may collect about you.
          </p>

          <p>
            This Privacy Policy explains how we collect, use, and share information about you when you use our services, including our website and applications (collectively, the "Service").
          </p>
        </>
      )
    },
    {
      id: 'information-collection',
      title: '2. Information We Collect',
      icon: <Eye className="size-5 text-habit-purple" />,
      content: (
        <>
          <p className="mb-4">We collect several different types of information for various purposes:</p>

          <h3 className="text-lg font-semibold mb-2">Personal Data</h3>
          <p className="mb-3">
            While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
          </p>

          <ul className="list-disc ml-5 mb-6 space-y-1">
            <li>Email address</li>
            <li>Name</li>
            <li>Usage data</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">Usage Data</h3>
          <p>
            We may also collect information on how the Service is accessed and used ("Usage Data"). This may include information such as your computer's Internet Protocol address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
          </p>
        </>
      )
    },
    {
      id: 'data-usage',
      title: '3. How We Use Your Information',
      icon: <FileCheck className="size-5 text-habit-teal" />,
      content: (
        <>
          <p className="mb-4">HabitVault uses the collected data for various purposes:</p>

          <ul className="list-disc ml-5 space-y-1">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </>
      )
    },
    {
      id: 'data-retention',
      title: '4. Data Retention',
      icon: <RefreshCw className="size-5 text-habit-teal" />,
      content: (
        <>
          <p>
            We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
          </p>
        </>
      )
    },
    {
      id: 'data-transfer',
      title: '5. Transfer Of Data',
      icon: <Trash2 className="size-5 text-habit-purple" />,
      content: (
        <>
          <p>
            Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
          </p>
        </>
      )
    },
    {
      id: 'security',
      title: '6. Security',
      icon: <Lock className="size-5 text-habit-teal" />,
      content: (
        <>
          <div className="p-4 bg-habit-teal/5 border border-habit-teal/20 rounded-lg mb-4">
            <p className="text-sm">
              <strong>Important:</strong> While we implement safeguards designed to protect your information, no security system is impenetrable. Due to the inherent nature of the Internet, we cannot guarantee that data is absolutely safe from intrusion by others.
            </p>
          </div>
          <p>
            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </>
      )
    },
    {
      id: 'your-rights',
      title: '7. Your Rights',
      icon: <Bell className="size-5 text-habit-purple" />,
      content: (
        <>
          <p className="mb-4">
            You have the right to:
          </p>

          <ul className="list-disc ml-5 space-y-1">
            <li>Access the personal information we hold about you</li>
            <li>Request the correction of inaccurate personal information</li>
            <li>Request the deletion of your personal information</li>
            <li>Object to the processing of your personal information</li>
            <li>Request the restriction of processing of your personal information</li>
            <li>Request the transfer of your personal information</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </>
      )
    },
    {
      id: 'policy-changes',
      title: '8. Changes To This Privacy Policy',
      icon: <RefreshCw className="size-5 text-habit-teal" />,
      content: (
        <>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
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
            If you have any questions about this Privacy Policy, please contact us:
            <br />
            <a 
              href="mailto:privacy@habitvault.com" 
              className="text-habit-purple hover:underline mt-2 inline-block"
            >
              privacy@habitvault.com
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
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: May 13, 2025</p>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 bg-gradient-to-r from-habit-purple to-habit-teal max-w-xs mx-auto mt-6"
          />
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
          className="mb-12 bg-muted/30 p-6 rounded-xl border border-border/30"
        >
          <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
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
                  <div className="bg-gradient-to-r from-habit-purple/5 to-transparent border-b border-border/30 p-4 flex items-center">
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
          className="mt-12 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>This policy is effective as of May 13, 2025</p>
          <p className="mt-2">Copyright © 2025 HabitVault. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
