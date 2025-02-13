
import { AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export const TemplateAlert = () => {
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

  return (
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
  );
};
