
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type LeadFile = {
  id: string;
  fileName: string;
  leadCount: number;
  importDate: string;
  status: "processing" | "completed" | "error";
};

const MyLeads = () => {
  const navigate = useNavigate();
  const [leadFiles, setLeadFiles] = useState<LeadFile[]>([]);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  useEffect(() => {
    const storedFiles = localStorage.getItem('leadFiles');
    if (storedFiles) {
      setLeadFiles(JSON.parse(storedFiles));
    }
  }, []);

  const handleDelete = (fileId: string) => {
    const updatedFiles = leadFiles.filter(file => file.id !== fileId);
    localStorage.setItem('leadFiles', JSON.stringify(updatedFiles));
    setLeadFiles(updatedFiles);
    setFileToDelete(null);
    toast.success("Import supprimé avec succès");
  };

  const getStatusBadge = (status: LeadFile["status"], fileId: string) => {
    const styles = {
      completed: "bg-green-100 text-green-800 hover:bg-green-100",
      processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      error: "bg-red-100 text-red-800 hover:bg-red-100",
    };

    const statusElement = (
      <Badge className={styles[status]} variant="secondary">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );

    if (status === "processing") {
      return (
        <div className="flex items-center gap-2">
          {statusElement}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-market-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Our teams are currently processing your file. Please be patient.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {statusElement}
        <button 
          onClick={() => setFileToDelete(fileId)}
          className="hover:text-red-600 transition-colors"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      </div>
    );
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-market-900">My Leads</h1>
        <p className="text-market-600">
          View and manage your imported lead files
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="mb-6">
            <Button 
              onClick={() => navigate("/upload-leads")}
              className="bg-market-600 hover:bg-market-700 text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Add Leads
            </Button>
          </div>
          
          {leadFiles.length === 0 ? (
            <p className="text-center text-market-600 py-8">No lead files uploaded yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead className="text-right">Number of Leads</TableHead>
                  <TableHead>Import Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{file.fileName}</TableCell>
                    <TableCell className="text-right">{file.leadCount}</TableCell>
                    <TableCell>
                      {format(new Date(file.importDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{getStatusBadge(file.status, file.id)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      <AlertDialog open={!!fileToDelete} onOpenChange={() => setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet import ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Les données de l'import seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => fileToDelete && handleDelete(fileToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyLeads;
