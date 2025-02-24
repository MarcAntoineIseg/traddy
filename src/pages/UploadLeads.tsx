
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
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    if (!gdprAccepted) {
      toast.error("Veuillez accepter la conformité RGPD");
      return;
    }
    if (!consentVerified) {
      toast.error("Veuillez vérifier que vous avez un consentement valide pour tous les leads");
      return;
    }

    setIsUploading(true);
    
    try {
      // Vérifier que l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }

      const leadCount = await countCsvLines(selectedFile);
      
      // D'abord créer l'enregistrement dans Supabase
      const { error: dbError } = await supabase
        .from('lead_files')
        .insert({
          file_name: selectedFile.name,
          lead_count: leadCount,
          status: 'processing',
          user_id: user.id,
          import_date: new Date().toISOString()
        });

      if (dbError) {
        console.error('Error inserting file record:', dbError);
        throw dbError;
      }

      // Ensuite envoyer à N8N
      await sendToN8N(selectedFile);
      
      toast.success(`Fichier téléchargé avec succès et envoyé pour traitement`);
      navigate("/my-leads");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Échec du téléchargement et du traitement du fichier. Veuillez réessayer.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <BackButton />
        <h1 className="text-2xl font-semibold text-market-900">Upload Leads</h1>
        <p className="text-market-600">Téléchargez votre fichier CSV contenant les données des leads</p>
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
                {selectedFile ? `Sélectionné: ${selectedFile.name}` : "Aucun fichier sélectionné"}
              </p>
              <Button
                onClick={handleUpload}
                className="bg-market-600 hover:bg-market-700 text-white"
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? "Téléchargement..." : "Télécharger les leads"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UploadLeads;
