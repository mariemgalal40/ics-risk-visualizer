import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Database, Calculator, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssetInput } from './steps/AssetInput';
import { TechniqueSelection } from './steps/TechniqueSelection';
import { RiskScoring } from './steps/RiskScoring';
import { MitigationReport } from './steps/MitigationReport';

export interface AssetData {
  name: string;
  type: string;
}

export interface TechniqueData {
  id: string;
  name: string;
  tactic: string;
  description?: string;
}

export interface RiskScore {
  techniqueId: string;
  score: number;
  asset: string;
}

const steps = [
  { id: 1, title: 'Asset Input', icon: Database, description: 'Define your ICS assets' },
  { id: 2, title: 'Technique Selection', icon: Shield, description: 'Select MITRE ATT&CK techniques' },
  { id: 3, title: 'Risk Scoring', icon: Calculator, description: 'Calculate risk scores' },
  { id: 4, title: 'Generate Report', icon: FileText, description: 'Review and export results' }
];

export const RiskAssessmentStepper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [assetData, setAssetData] = useState<AssetData>({ name: '', type: '' });
  const [selectedTechniques, setSelectedTechniques] = useState<TechniqueData[]>([]);
  const [riskScores, setRiskScores] = useState<RiskScore[]>([]);

  const canProceed = (step: number) => {
    switch (step) {
      case 1:
        return assetData.name.trim() !== '';
      case 2:
        return selectedTechniques.length > 0;
      case 3:
        return riskScores.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 4 && canProceed(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AssetInput 
            assetData={assetData} 
            setAssetData={setAssetData}
          />
        );
      case 2:
        return (
          <TechniqueSelection 
            selectedTechniques={selectedTechniques}
            setSelectedTechniques={setSelectedTechniques}
          />
        );
      case 3:
        return (
          <RiskScoring 
            selectedTechniques={selectedTechniques}
            assetData={assetData}
            riskScores={riskScores}
            setRiskScores={setRiskScores}
          />
        );
      case 4:
        return (
          <MitigationReport 
            assetData={assetData}
            selectedTechniques={selectedTechniques}
            riskScores={riskScores}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-header text-primary-foreground p-6 shadow-medium">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8" />
            CyberRisk Assessment
          </h1>
          <p className="text-primary-foreground/80 mt-2">
            MITRE ATT&CK Framework Risk Analysis for ICS Assets
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Progress Steps */}
        <Card className="mb-8 bg-gradient-card shadow-soft">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
                          isCompleted && "bg-success text-success-foreground shadow-soft",
                          isCurrent && "bg-primary text-primary-foreground shadow-medium scale-110",
                          !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className={cn(
                          "font-semibold text-sm",
                          isCurrent && "text-primary",
                          isCompleted && "text-success"
                        )}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div 
                        className={cn(
                          "flex-1 h-0.5 mx-4 transition-all duration-300",
                          isCompleted ? "bg-success" : "bg-border"
                        )} 
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="mb-8 shadow-medium">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="min-w-24"
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={currentStep === 4 || !canProceed(currentStep)}
            className="min-w-24 bg-primary hover:bg-primary-dark"
          >
            {currentStep === 4 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};