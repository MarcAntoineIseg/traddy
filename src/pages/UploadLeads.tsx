
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/upload-leads/BackButton";
import { TemplateAlert } from "@/components/upload-leads/TemplateAlert";
import { FileUploader } from "@/components/upload-leads/FileUploader";
import { ConsentCheckboxes } from "@/components/upload-leads/ConsentCheckboxes";
import { sendToN8N, countCsvLines } from "@/services/uploadService";
import { supabase } from "@/integrations/supabase/client";

const UploadLeads = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [consentVerified, setConsentVerified] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
      const leadCount = await countCsvLines(selectedFile);
      await sendToN8N(selectedFile);
      
      const { error } = await supabase
        .from('lead_files')
        .insert({
          file_name: selectedFile.name,
          lead_count: leadCount,
          status: 'processing'
        });

      if (error) {
        console.error('Error inserting file record:', error);
        throw error;
      }
      
      toast.success(`File uploaded successfully and sent for processing`);
      navigate("/my-leads");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload and process file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <BackButton />
        <h1 className="text-2xl font-semibold text-market-900">Upload Leads</h1>
        <p className="text-market-600">Upload your CSV file containing lead data</p>
      </div>

      <TemplateAlert />

      <Card className="max-w-2xl">
        <div className="p-6">
          <FileUploader 
            isUploading={isUploading}
            onFileSelect={setSelectedFile}
          />
          
          <div className="space-y-4">
            <ConsentCheckboxes 
              gdprAccepted={gdprAccepted}
              consentVerified={consentVerified}
              setGdprAccepted={setGdprAccepted}
              setConsentVerified={setConsentVerified}
              isUploading={isUploading}
            />

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
