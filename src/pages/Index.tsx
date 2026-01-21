import { FileText, ScanLine, ImagePlus } from "lucide-react";
import Header from "@/components/dashboard/Header";
import ActionCard from "@/components/dashboard/ActionCard";

const Index = () => {
  const handleTypeContent = () => {
    console.log("Type Content clicked");
  };

  const handleScanDocument = () => {
    console.log("Scan Document clicked");
  };

  const handleUploadImage = () => {
    console.log("Upload Image clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Welcome back
          </h2>
          <p className="text-muted-foreground">
            What would you like to do today?
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          <ActionCard
            title="Type Content"
            description="Create and edit text content manually"
            icon={FileText}
            onClick={handleTypeContent}
          />
          <ActionCard
            title="Scan Document"
            description="Capture text from physical documents"
            icon={ScanLine}
            onClick={handleScanDocument}
          />
          <ActionCard
            title="Upload Image"
            description="Extract content from image files"
            icon={ImagePlus}
            onClick={handleUploadImage}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
