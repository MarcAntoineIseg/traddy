
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

const UploadLeads = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [consentVerified, setConsentVerified] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv") {
        toast.error("Please upload a CSV file");
        return;
      }
      setSelectedFile(file);
      toast.success("File selected successfully");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    if (!gdprAccepted) {
      toast.error("Please accept the GDPR compliance checkbox");
      return;
    }
    if (!consentVerified) {
      toast.error("Please verify that you have valid consent for all leads");
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save file data to localStorage
      const existingFiles = JSON.parse(localStorage.getItem('leadFiles') || '[]');
      const newFile = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        leadCount: Math.floor(Math.random() * 200) + 50, // Simulated lead count
        importDate: new Date().toISOString(),
        status: "completed" as const
      };
      
      localStorage.setItem('leadFiles', JSON.stringify([newFile, ...existingFiles]));
      
      toast.success("File uploaded successfully");
      navigate("/my-leads");
    } catch (error) {
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-semibold text-market-900">Upload Leads</h1>
        <p className="text-market-600">Upload your CSV file containing lead data</p>
      </div>

      <Card className="max-w-2xl">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-market-200 rounded-lg p-8 mb-6">
            <Upload className="h-12 w-12 text-market-400 mb-4" />
            <p className="text-market-600 mb-4 text-center">
              Drag and drop your CSV file here, or click to browse
            </p>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="max-w-xs"
              disabled={isUploading}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="gdpr" 
                checked={gdprAccepted}
                onCheckedChange={(checked) => setGdprAccepted(checked as boolean)}
                disabled={isUploading}
              />
              <label
                htmlFor="gdpr"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                En transmettant mon fichier je certifie que les données présentent dans ce fichier respectent le RGPD
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="consent" 
                checked={consentVerified}
                onCheckedChange={(checked) => setConsentVerified(checked as boolean)}
                disabled={isUploading}
              />
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Je certifie avoir intégré une preuve de consentement valide pour chacun des leads
              </label>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-market-600">
                {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
              </p>
              <Button
                onClick={handleUpload}
                className="bg-market-600 hover:bg-market-700 text-white"
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Leads"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UploadLeads;
