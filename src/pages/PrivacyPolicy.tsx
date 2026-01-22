import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Privacy Policy
          </h1>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-8">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: January 22, 2026</p>

          <h2 className="text-foreground mt-8">1. Information We Collect</h2>
          <p className="text-muted-foreground">We collect information you provide directly to us, including:</p>
          <ul className="text-muted-foreground">
            <li>Account information (email address, name)</li>
            <li>Content you submit for summarization (text, images)</li>
            <li>Preferences and settings</li>
            <li>Usage data and analytics</li>
          </ul>

          <h2 className="text-foreground mt-6">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">We use the information we collect to:</p>
          <ul className="text-muted-foreground">
            <li>Provide, maintain, and improve the Service</li>
            <li>Process your content and generate summaries</li>
            <li>Personalize your experience</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your requests and inquiries</li>
          </ul>

          <h2 className="text-foreground mt-6">3. Data Storage and Security</h2>
          <p className="text-muted-foreground">
            We use industry-standard security measures to protect your data. Your content is stored securely using Supabase infrastructure with encryption at rest and in transit.
          </p>

          <h2 className="text-foreground mt-6">4. Data Retention</h2>
          <p className="text-muted-foreground">
            We retain your data as long as your account is active. You can delete your data at any time by using the "Clear History" feature or by deleting your account entirely.
          </p>

          <h2 className="text-foreground mt-6">5. Third-Party Services</h2>
          <p className="text-muted-foreground">We use the following third-party services:</p>
          <ul className="text-muted-foreground">
            <li>Supabase for authentication and database storage</li>
            <li>AI services (Gemini, GPT) for content summarization</li>
            <li>Cloud storage for document images</li>
          </ul>

          <h2 className="text-foreground mt-6">6. Your Rights</h2>
          <p className="text-muted-foreground">You have the right to:</p>
          <ul className="text-muted-foreground">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data</li>
            <li>Export your data</li>
            <li>Opt out of marketing communications</li>
          </ul>

          <h2 className="text-foreground mt-6">7. Children's Privacy</h2>
          <p className="text-muted-foreground">
            The Service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </p>

          <h2 className="text-foreground mt-6">8. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-foreground mt-6">9. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@mindlink.app.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
