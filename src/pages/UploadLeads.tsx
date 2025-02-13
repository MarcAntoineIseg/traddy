import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, ArrowLeft, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UploadLeads = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [consentVerified, setConsentVerified] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDownloadTemplate = () => {
    const csvHeader = "ENTREPRISE;TELEPHONE;EMAIL;SIRET;DOMAINE;SOURCE;LEAD_CERTIFIÉ;DATE_CONSENTEMENT;PREUVE_CONSENTEMENT;COMMENTAIRE\n";
    const csvContent = `${csvHeader}Exemple SARL;0123456789;contact@exemple.fr;12345678901234;Marketing Digital;LinkedIn;OUI;2024-01-01;https://lien-vers-preuve.com;Premier contact\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_import_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Template téléchargé avec succès");
  };

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

  const countCsvLines = async (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        resolve(Math.max(0, lines.length - 1)); // Ensure we don't return negative numbers
      };
      reader.readAsText(file);
    });
  };

  const sendToN8N = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://n8n.traddy.fr/webhook/3d048e76-9ee2-4705-8953-34d94f770a8c', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to send file to N8N');
      }

      return true;
    } catch (error) {
      console.error('Error sending file to N8N:', error);
      throw error;
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
      const leadCount = await countCsvLines(selectedFile);
      
      await sendToN8N(selectedFile);
      
      const existingFiles = JSON.parse(localStorage.getItem('leadFiles') || '[]');
      const newFile = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        leadCount,
        importDate: new Date().toISOString(),
        status: "processing" as const
      };
      
      localStorage.setItem('leadFiles', JSON.stringify([newFile, ...existingFiles]));
      
      toast.success(`File uploaded successfully and sent for processing`);
      navigate("/my-leads");
    } catch (error) {
      toast.error("Failed to upload and process file. Please try again.");
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

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="flex items-center justify-between">
          <span className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-red-400" />
            Please ensure that your file contains the required criteria. Download this template:
          </span>
          <Button variant="outline" size="sm" className="ml-4" onClick={handleDownloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </AlertDescription>
      </Alert>

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
