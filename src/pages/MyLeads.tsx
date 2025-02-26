
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
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type LeadFile = {
  id: string;
  file_name: string;
  lead_count: number;
  import_date: string;
  status: "processing" | "completed" | "error";
};

const MyLeads = () => {
  const navigate = useNavigate();
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: leadFiles = [], isLoading } = useQuery({
    queryKey: ['leadFiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lead files:', error);
        throw error;
      }

      return data as LeadFile[];
    }
  });

  const handleDelete = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('lead_files')
        .delete()
        .eq('id', fileId);

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['leadFiles'] });
      setFileToDelete(null);
      toast.success("Import supprimé avec succès");
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error("Une erreur est survenue lors de la suppression");
    }
  };

  const getStatusBadge = (status: LeadFile["status"]) => {
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

    return statusElement;
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{file.file_name}</TableCell>
                    <TableCell className="text-right">{file.lead_count}</TableCell>
                    <TableCell>
                      {format(new Date(file.import_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{getStatusBadge(file.status)}</TableCell>
                    <TableCell>
                      <button 
                        onClick={() => setFileToDelete(file.id)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </TableCell>
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
