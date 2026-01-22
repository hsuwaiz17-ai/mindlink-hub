import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
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
            Terms of Service
          </h1>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-8">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: January 22, 2026</p>

          <h2 className="text-foreground mt-8">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using MindLink ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>

          <h2 className="text-foreground mt-6">2. Description of Service</h2>
          <p className="text-muted-foreground">
            MindLink is an AI-powered content summarization service that allows users to input text or images and receive intelligent summaries in various languages.
          </p>

          <h2 className="text-foreground mt-6">3. User Accounts</h2>
          <p className="text-muted-foreground">
            To use certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <h2 className="text-foreground mt-6">4. Acceptable Use</h2>
          <p className="text-muted-foreground">You agree not to:</p>
          <ul className="text-muted-foreground">
            <li>Use the Service for any unlawful purpose</li>
            <li>Upload or transmit harmful, offensive, or inappropriate content</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Interfere with or disrupt the Service's operation</li>
            <li>Use the Service to infringe on intellectual property rights</li>
          </ul>

          <h2 className="text-foreground mt-6">5. Intellectual Property</h2>
          <p className="text-muted-foreground">
            The Service and its original content, features, and functionality are owned by MindLink and are protected by international copyright, trademark, and other intellectual property laws.
          </p>

          <h2 className="text-foreground mt-6">6. User Content</h2>
          <p className="text-muted-foreground">
            You retain ownership of any content you submit to the Service. By submitting content, you grant us a license to process, store, and display your content solely for the purpose of providing the Service.
          </p>

          <h2 className="text-foreground mt-6">7. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            The Service is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
          </p>

          <h2 className="text-foreground mt-6">8. Termination</h2>
          <p className="text-muted-foreground">
            We reserve the right to terminate or suspend your account at any time for any reason without prior notice. You may also delete your account at any time through the Settings page.
          </p>

          <h2 className="text-foreground mt-6">9. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service.
          </p>

          <h2 className="text-foreground mt-6">10. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms of Service, please contact us through the app or at support@mindlink.app.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
