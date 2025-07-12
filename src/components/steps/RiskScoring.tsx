import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Calculator, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TechniqueData, AssetData, RiskScore } from '../RiskAssessmentStepper';

interface RiskScoringProps {
  selectedTechniques: TechniqueData[];
  assetData: AssetData;
  riskScores: RiskScore[];
  setRiskScores: (scores: RiskScore[]) => void;
}

const getRiskLevel = (score: number): { level: string; color: string; bgColor: string } => {
  if (score >= 9) return { level: 'Critical', color: 'text-risk-critical', bgColor: 'bg-risk-critical' };
  if (score >= 7) return { level: 'High', color: 'text-risk-high', bgColor: 'bg-risk-high' };
  if (score >= 5) return { level: 'Medium', color: 'text-risk-medium', bgColor: 'bg-risk-medium' };
  if (score >= 3) return { level: 'Low', color: 'text-risk-low', bgColor: 'bg-risk-low' };
  return { level: 'Minimal', color: 'text-risk-minimal', bgColor: 'bg-risk-minimal' };
};

export const RiskScoring: React.FC<RiskScoringProps> = ({
  selectedTechniques,
  assetData,
  riskScores,
  setRiskScores
}) => {
  // Initialize risk scores with default values
  useEffect(() => {
    const newScores = selectedTechniques.map(technique => {
      const existingScore = riskScores.find(score => score.techniqueId === technique.id);
      return existingScore || {
        techniqueId: technique.id,
        score: 5, // Default medium risk
        asset: assetData.name
      };
    });
    setRiskScores(newScores);
  }, [selectedTechniques, assetData.name]);

  const updateScore = (techniqueId: string, newScore: number) => {
    setRiskScores(riskScores.map(score =>
      score.techniqueId === techniqueId
        ? { ...score, score: newScore }
        : score
    ));
  };

  const calculateTotalRisk = () => {
    if (riskScores.length === 0) return 0;
    const total = riskScores.reduce((sum, score) => sum + score.score, 0);
    return Math.round((total / riskScores.length) * 10) / 10;
  };

  const totalRisk = calculateTotalRisk();
  const totalRiskLevel = getRiskLevel(totalRisk);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Risk Scoring</h2>
        <p className="text-muted-foreground">
          Assign risk scores to each technique based on your asset's exposure and impact potential.
        </p>
      </div>

      {/* Summary Card */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Risk Assessment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{assetData.name}</div>
              <div className="text-sm text-muted-foreground">Asset Under Assessment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedTechniques.length}</div>
              <div className="text-sm text-muted-foreground">Techniques Evaluated</div>
            </div>
            <div className="text-center">
              <div className={cn("text-2xl font-bold", totalRiskLevel.color)}>
                {totalRisk}/10
              </div>
              <div className="text-sm text-muted-foreground">Average Risk Score</div>
              <Badge className={cn("mt-1", totalRiskLevel.bgColor, "text-white")}>
                {totalRiskLevel.level}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Scoring Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Technique Risk Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Technique ID</TableHead>
                  <TableHead>Technique Name</TableHead>
                  <TableHead>Tactic</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-center">Risk Score</TableHead>
                  <TableHead className="text-center">Risk Level</TableHead>
                  <TableHead className="text-center">Adjust Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTechniques.map((technique) => {
                  const score = riskScores.find(s => s.techniqueId === technique.id)?.score || 5;
                  const riskLevel = getRiskLevel(score);
                  
                  return (
                    <TableRow key={technique.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {technique.id}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-48">
                          <div className="font-medium">{technique.name}</div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {technique.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {technique.tactic}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {assetData.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={score}
                          onChange={(e) => updateScore(technique.id, Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-16 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(riskLevel.bgColor, "text-white")}>
                          {riskLevel.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <Slider
                            value={[score]}
                            onValueChange={(value) => updateScore(technique.id, value[0])}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>1</span>
                            <span>10</span>
                          </div>
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

      {/* Risk Legend */}
      <Card className="shadow-soft bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm">Risk Score Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { level: 'Minimal', range: '1-2', bgColor: 'bg-risk-minimal' },
              { level: 'Low', range: '3-4', bgColor: 'bg-risk-low' },
              { level: 'Medium', range: '5-6', bgColor: 'bg-risk-medium' },
              { level: 'High', range: '7-8', bgColor: 'bg-risk-high' },
              { level: 'Critical', range: '9-10', bgColor: 'bg-risk-critical' }
            ].map((item) => (
              <div key={item.level} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded", item.bgColor)} />
                <div className="text-sm">
                  <div className="font-medium">{item.level}</div>
                  <div className="text-xs text-muted-foreground">{item.range}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {riskScores.length > 0 && (
        <Card className="border-success/50 bg-success/5 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-success">
              <Calculator className="h-5 w-5" />
              <span className="font-medium">
                Risk assessment complete for {riskScores.length} technique{riskScores.length > 1 ? 's' : ''}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};