import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Share, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TechniqueData, AssetData, RiskScore } from '../RiskAssessmentStepper';

interface MitigationReportProps {
  assetData: AssetData;
  selectedTechniques: TechniqueData[];
  riskScores: RiskScore[];
}

// Mock mitigation data - in real app, this would come from MITRE database
const mockMitigations: Record<string, string[]> = {
  'T0817': ['Network Segmentation', 'Application Isolation and Sandboxing', 'Restrict Web-Based Content'],
  'T0819': ['Network Segmentation', 'Privileged Account Management', 'Update Software'],
  'T0866': ['Disable or Remove Feature or Program', 'Network Segmentation', 'Multi-factor Authentication'],
  'T0821': ['Code Signing', 'Privileged Account Management', 'Execution Prevention'],
  'T0823': ['Privileged Account Management', 'User Account Management', 'Application Developer Guidance'],
  'T0874': ['Application Developer Guidance', 'Execution Prevention', 'Privileged Account Management'],
  'T0859': ['Multi-factor Authentication', 'Privileged Account Management', 'User Account Management'],
  'T0839': ['Boot Integrity', 'Code Signing', 'Privileged Account Management'],
  'T0889': ['Code Signing', 'Privileged Account Management', 'Application Developer Guidance'],
  'T0826': ['Data Backup', 'Network Segmentation', 'Redundancy and Load Balancing'],
  'T0827': ['Network Segmentation', 'Privileged Account Management', 'Multi-factor Authentication'],
  'T0828': ['Data Backup', 'Network Segmentation', 'Incident Response']
};

const getRiskLevel = (score: number): { level: string; color: string; bgColor: string } => {
  if (score >= 9) return { level: 'Critical', color: 'text-risk-critical', bgColor: 'bg-risk-critical' };
  if (score >= 7) return { level: 'High', color: 'text-risk-high', bgColor: 'bg-risk-high' };
  if (score >= 5) return { level: 'Medium', color: 'text-risk-medium', bgColor: 'bg-risk-medium' };
  if (score >= 3) return { level: 'Low', color: 'text-risk-low', bgColor: 'bg-risk-low' };
  return { level: 'Minimal', color: 'text-risk-minimal', bgColor: 'bg-risk-minimal' };
};

export const MitigationReport: React.FC<MitigationReportProps> = ({
  assetData,
  selectedTechniques,
  riskScores
}) => {
  const calculateTotalRisk = () => {
    if (riskScores.length === 0) return 0;
    const total = riskScores.reduce((sum, score) => sum + score.score, 0);
    return Math.round((total / riskScores.length) * 10) / 10;
  };

  const generateReport = () => {
    const reportData = {
      asset: assetData,
      techniques: selectedTechniques,
      scores: riskScores,
      totalRisk: calculateTotalRisk(),
      timestamp: new Date().toISOString()
    };
    
    // In a real application, this would generate a PDF or export to file
    console.log('Generating report:', reportData);
    alert('Report generation would be implemented here. Check console for data structure.');
  };

  const totalRisk = calculateTotalRisk();
  const totalRiskLevel = getRiskLevel(totalRisk);
  
  const highRiskTechniques = riskScores.filter(score => score.score >= 7).length;
  const mediumRiskTechniques = riskScores.filter(score => score.score >= 5 && score.score < 7).length;
  const lowRiskTechniques = riskScores.filter(score => score.score < 5).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Mitigation Report</h2>
        <p className="text-muted-foreground">
          Comprehensive cybersecurity risk assessment report with recommended mitigations.
        </p>
      </div>

      {/* Executive Summary */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-foreground">{assetData.name}</div>
              <div className="text-sm text-muted-foreground">Asset Assessed</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-primary">{selectedTechniques.length}</div>
              <div className="text-sm text-muted-foreground">Techniques Evaluated</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={cn("text-lg font-bold", totalRiskLevel.color)}>
                {totalRisk}/10
              </div>
              <div className="text-sm text-muted-foreground">Overall Risk Score</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Badge className={cn("text-sm", totalRiskLevel.bgColor, "text-white")}>
                {totalRiskLevel.level} Risk
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Risk Classification</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-risk-high">{highRiskTechniques}</div>
              <div className="text-sm text-muted-foreground">High Risk</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-risk-medium">{mediumRiskTechniques}</div>
              <div className="text-sm text-muted-foreground">Medium Risk</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-risk-low">{lowRiskTechniques}</div>
              <div className="text-sm text-muted-foreground">Low Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Assessment */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Detailed Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Technique</TableHead>
                  <TableHead>Tactic</TableHead>
                  <TableHead className="text-center">Risk Score</TableHead>
                  <TableHead>Recommended Mitigations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTechniques.map((technique) => {
                  const score = riskScores.find(s => s.techniqueId === technique.id)?.score || 5;
                  const riskLevel = getRiskLevel(score);
                  const mitigations = mockMitigations[technique.id] || ['General Security Measures'];
                  
                  return (
                    <TableRow key={technique.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              {technique.id}
                            </Badge>
                            {technique.name}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {technique.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {technique.tactic}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn("font-bold", riskLevel.color)}>
                            {score}/10
                          </span>
                          <Badge className={cn("text-xs", riskLevel.bgColor, "text-white")}>
                            {riskLevel.level}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {mitigations.map((mitigation, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-success" />
                              <span className="text-sm">{mitigation}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="shadow-soft bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            Key Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5" />
              <div>
                <div className="font-medium">Implement Network Segmentation</div>
                <div className="text-sm text-muted-foreground">
                  Isolate critical ICS components from corporate networks to reduce attack surface.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5" />
              <div>
                <div className="font-medium">Deploy Multi-factor Authentication</div>
                <div className="text-sm text-muted-foreground">
                  Strengthen access controls for privileged accounts and critical systems.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5" />
              <div>
                <div className="font-medium">Regular Security Updates</div>
                <div className="text-sm text-muted-foreground">
                  Maintain current patch levels and implement change management processes.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5" />
              <div>
                <div className="font-medium">Continuous Monitoring</div>
                <div className="text-sm text-muted-foreground">
                  Implement security monitoring and incident response capabilities.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Export Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={generateReport}
              className="flex-1 bg-primary hover:bg-primary-dark"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate PDF Report
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => alert('Export to Excel functionality would be implemented here')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => alert('Share functionality would be implemented here')}
            >
              <Share className="h-4 w-4 mr-2" />
              Share Report
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Reports include detailed risk assessments, mitigation recommendations, and executive summaries 
            suitable for stakeholder presentations.
          </p>
        </CardContent>
      </Card>

      <Card className="border-success/50 bg-success/5 shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-success">
            <FileText className="h-5 w-5" />
            <span className="font-medium">
              Risk assessment complete! Review the detailed analysis and export your report.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};