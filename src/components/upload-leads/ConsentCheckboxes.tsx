
import { Checkbox } from "@/components/ui/checkbox";

interface ConsentCheckboxesProps {
  gdprAccepted: boolean;
  consentVerified: boolean;
  setGdprAccepted: (value: boolean) => void;
  setConsentVerified: (value: boolean) => void;
  isUploading: boolean;
}

export const ConsentCheckboxes = ({
  gdprAccepted,
  consentVerified,
  setGdprAccepted,
  setConsentVerified,
  isUploading
}: ConsentCheckboxesProps) => {
  return (
    <>
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
    </>
  );
};
