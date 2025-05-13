
import { motion } from 'framer-motion';

const TermsPage = () => {
  return (
    <div className="py-24">
      <div className="container px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
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
            Welcome to HabitVault! These Terms of Service govern your use of our website and services.
            By accessing our website at <a href="https://habitvault.com">https://habitvault.com</a>, you agree to these terms.
          </p>

          <h2>2. Definitions</h2>
          <p>
            <strong>"Service"</strong> refers to the HabitVault application, website, and related services.
            <br />
            <strong>"User"</strong> refers to individuals who access or use the Service.
            <br />
            <strong>"Account"</strong> refers to a registered account within the Service.
          </p>

          <h2>3. Account Registration</h2>
          <p>
            When you create an account with us, you must provide accurate and complete information.
            You are responsible for maintaining the security of your account and password.
            We cannot and will not be liable for any loss or damage from your failure to comply
            with this security obligation.
          </p>

          <h2>4. User Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain
            information, text, graphics, or other material. You retain any rights to any content
            you submit, post or display on or through the Service.
          </p>

          <h2>5. Service Modifications</h2>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently, the Service
            with or without notice. We shall not be liable to you or to any third party for any
            modification, suspension or discontinuance of the Service.
          </p>

          <h2>6. Limitation Of Liability</h2>
          <p>
            In no event shall HabitVault, nor its directors, employees, partners, agents, suppliers,
            or affiliates, be liable for any indirect, incidental, special, consequential or punitive
            damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
            losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2>7. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws, without regard
            to its conflict of law provisions.
          </p>

          <h2>8. Changes To Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
            It is your responsibility to review these Terms periodically for changes.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            <a href="mailto:legal@habitvault.com">legal@habitvault.com</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
