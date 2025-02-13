
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

// Types for our lead file data
type LeadFile = {
  id: string;
  fileName: string;
  leadCount: number;
  importDate: string; // Changed to string for localStorage compatibility
  status: "processing" | "completed" | "error";
};

const MyLeads = () => {
  const [leadFiles, setLeadFiles] = useState<LeadFile[]>([]);

  useEffect(() => {
    // Load existing files from localStorage
    const storedFiles = localStorage.getItem('leadFiles');
    if (storedFiles) {
      setLeadFiles(JSON.parse(storedFiles));
    }
  }, []);

  const getStatusBadge = (status: LeadFile["status"]) => {
    const styles = {
      completed: "bg-green-100 text-green-800 hover:bg-green-100",
      processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      error: "bg-red-100 text-red-800 hover:bg-red-100",
    };

    return (
      <Badge className={styles[status]} variant="secondary">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
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
                    <TableCell>{getStatusBadge(file.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MyLeads;
