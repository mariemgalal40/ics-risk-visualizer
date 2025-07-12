// Data service for handling Excel imports and MITRE ATT&CK data
import { TechniqueData } from '@/components/RiskAssessmentStepper';

export interface ExcelDataRow {
  techniqueId: string;
  techniqueName: string;
  tactic: string;
  description?: string;
  mitigations?: string[];
}

// Service to handle Excel data import and processing
export class DataService {
  private static instance: DataService;
  private tactics: string[] = [];
  private techniques: Record<string, TechniqueData[]> = {};
  private mitigations: Record<string, string[]> = {};

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Method to load data from Excel file
  public async loadFromExcel(file: File): Promise<void> {
    // This would implement actual Excel parsing
    // For now, showing the structure you'd need
    const excelData = await this.parseExcelFile(file);
    this.processExcelData(excelData);
  }

  // Method to load data from JSON (alternative to Excel)
  public loadFromJSON(data: ExcelDataRow[]): void {
    this.processExcelData(data);
  }

  private async parseExcelFile(file: File): Promise<ExcelDataRow[]> {
    // You would use a library like 'xlsx' or 'read-excel-file' here
    // For example: const workbook = XLSX.read(await file.arrayBuffer());
    
    // Mock implementation - replace with actual Excel parsing
    return [];
  }

  private processExcelData(data: ExcelDataRow[]): void {
    // Clear existing data
    this.tactics = [];
    this.techniques = {};
    this.mitigations = {};

    // Process each row
    data.forEach(row => {
      // Extract unique tactics
      if (!this.tactics.includes(row.tactic)) {
        this.tactics.push(row.tactic);
      }

      // Group techniques by tactic
      if (!this.techniques[row.tactic]) {
        this.techniques[row.tactic] = [];
      }

      const technique: TechniqueData = {
        id: row.techniqueId,
        name: row.techniqueName,
        tactic: row.tactic,
        description: row.description
      };

      this.techniques[row.tactic].push(technique);

      // Store mitigations
      if (row.mitigations) {
        this.mitigations[row.techniqueId] = row.mitigations;
      }
    });
  }

  // Getters for the UI components
  public getTactics(): string[] {
    return this.tactics;
  }

  public getTechniquesByTactic(tactic: string): TechniqueData[] {
    return this.techniques[tactic] || [];
  }

  public getMitigations(techniqueId: string): string[] {
    return this.mitigations[techniqueId] || [];
  }

  // Custom risk calculation method - you can modify this
  public calculateRisk(scores: number[], weights?: number[]): number {
    if (scores.length === 0) return 0;
    
    if (weights && weights.length === scores.length) {
      // Weighted average
      const weightedSum = scores.reduce((sum, score, index) => 
        sum + (score * weights[index]), 0);
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      return Math.round((weightedSum / totalWeight) * 10) / 10;
    } else {
      // Simple average (current implementation)
      const total = scores.reduce((sum, score) => sum + score, 0);
      return Math.round((total / scores.length) * 10) / 10;
    }
  }

  // Method to export data back to Excel format
  public exportToExcel(): ExcelDataRow[] {
    const exportData: ExcelDataRow[] = [];
    
    Object.entries(this.techniques).forEach(([tactic, techniques]) => {
      techniques.forEach(technique => {
        exportData.push({
          techniqueId: technique.id,
          techniqueName: technique.name,
          tactic: technique.tactic,
          description: technique.description,
          mitigations: this.mitigations[technique.id]
        });
      });
    });

    return exportData;
  }
}

export const dataService = DataService.getInstance();