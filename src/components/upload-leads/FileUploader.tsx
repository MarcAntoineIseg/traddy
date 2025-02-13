
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
  isUploading: boolean;
  onFileSelect: (file: File) => void;
}

export const FileUploader = ({ isUploading, onFileSelect }: FileUploaderProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv") {
        toast.error("Please upload a CSV file");
        return;
      }
      onFileSelect(file);
      toast.success("File selected successfully");
    }
  };

  return (
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
  );
};
