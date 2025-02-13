
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UploadLeads = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    // Here you would typically handle the file upload
    toast.success("File uploaded successfully");
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
            />
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-market-600">
              {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
            </p>
            <Button
              onClick={handleUpload}
              className="bg-market-600 hover:bg-market-700 text-white"
              disabled={!selectedFile}
            >
              Upload Leads
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UploadLeads;
