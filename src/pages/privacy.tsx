
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  return (
    <div className="py-24">
      <div className="container px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: May 13, 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <h2>1. Introduction</h2>
          <p>
            Your privacy is important to us. It is HabitVault's policy to respect your privacy and comply with any applicable law and regulation regarding any personal information we may collect about you.
          </p>

          <p>
            This Privacy Policy explains how we collect, use, and share information about you when you use our services, including our website and applications (collectively, the "Service").
          </p>

          <h2>2. Information We Collect</h2>
          <p>We collect several different types of information for various purposes:</p>

          <h3>Personal Data</h3>
          <p>
            While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
          </p>

          <ul>
            <li>Email address</li>
            <li>Name</li>
            <li>Usage data</li>
          </ul>

          <h3>Usage Data</h3>
          <p>
            We may also collect information on how the Service is accessed and used ("Usage Data"). This may include information such as your computer's Internet Protocol address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
          </p>

          <h2>3. How We Use Your Information</h2>
          <p>HabitVault uses the collected data for various purposes:</p>

          <ul>
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>
            We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
          </p>

          <h2>5. Transfer Of Data</h2>
          <p>
            Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
          </p>

          <h2>6. Security</h2>
          <p>
            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            You have the right to:
          </p>

          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request the correction of inaccurate personal information</li>
            <li>Request the deletion of your personal information</li>
            <li>Object to the processing of your personal information</li>
            <li>Request the restriction of processing of your personal information</li>
            <li>Request the transfer of your personal information</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2>8. Changes To This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
            <br />
            <a href="mailto:privacy@habitvault.com">privacy@habitvault.com</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
