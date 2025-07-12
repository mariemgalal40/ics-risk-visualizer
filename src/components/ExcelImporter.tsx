import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';

interface ExcelImporterProps {
  onDataLoaded: () => void;
}

export const ExcelImporter: React.FC<ExcelImporterProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive"
      });
      return;
    }

    try {
      await dataService.loadFromExcel(file);
      toast({
        title: "Data Loaded Successfully",
        description: "MITRE ATT&CK data has been imported from your Excel file."
      });
      onDataLoaded();
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Could not read the Excel file. Please check the format.",
        variant: "destructive"
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadSampleData = () => {
    // Load sample data for demonstration
    const sampleData = [
      {
        techniqueId: 'T0817',
        techniqueName: 'Drive-by Compromise',
        tactic: 'Initial Access',
        description: 'Adversaries may gain access to a system through a user visiting a website over the normal course of browsing.',
        mitigations: ['Network Segmentation', 'Application Isolation and Sandboxing', 'Restrict Web-Based Content']
      },
      {
        techniqueId: 'T0819',
        techniqueName: 'Exploit Public-Facing Application',
        tactic: 'Initial Access',
        description: 'Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program.',
        mitigations: ['Network Segmentation', 'Privileged Account Management', 'Update Software']
      },
      {
        techniqueId: 'T0821',
        techniqueName: 'Modify Controller Tasking',
        tactic: 'Execution',
        description: 'Adversaries may modify the tasking of a controller to allow for the execution of their own programs.',
        mitigations: ['Code Signing', 'Privileged Account Management', 'Execution Prevention']
      },
      {
        techniqueId: 'T0826',
        techniqueName: 'Loss of Availability',
        tactic: 'Impact',
        description: 'Adversaries may attempt to disrupt essential components or systems to prevent owner and operator use.',
        mitigations: ['Data Backup', 'Network Segmentation', 'Redundancy and Load Balancing']
      }
    ];

    dataService.loadFromJSON(sampleData);
    toast({
      title: "Sample Data Loaded",
      description: "Using sample MITRE ATT&CK data for demonstration."
    });
    onDataLoaded();
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          Data Source Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">Upload MITRE ATT&CK Excel Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your Excel file containing MITRE ATT&CK techniques, tactics, and mitigations.
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div className="space-y-2">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary hover:bg-primary-dark"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Excel File
            </Button>
            
            <Button 
              variant="outline" 
              onClick={loadSampleData}
              className="ml-2"
            >
              Use Sample Data
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Expected Excel Format</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Your Excel file should contain columns: Technique ID, Technique Name, Tactic, Description, Mitigations
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};