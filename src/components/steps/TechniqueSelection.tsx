import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Target, Plus, X } from 'lucide-react';
import { TechniqueData } from '../RiskAssessmentStepper';

interface TechniqueSelectionProps {
  selectedTechniques: TechniqueData[];
  setSelectedTechniques: (techniques: TechniqueData[]) => void;
}

// Mock MITRE ATT&CK data - in real app, this would come from Excel sheet
const mockTactics = [
  'Initial Access',
  'Execution',
  'Persistence',
  'Privilege Escalation',
  'Defense Evasion',
  'Credential Access',
  'Discovery',
  'Lateral Movement',
  'Collection',
  'Command and Control',
  'Exfiltration',
  'Impact'
];

const mockTechniques: Record<string, TechniqueData[]> = {
  'Initial Access': [
    { id: 'T0817', name: 'Drive-by Compromise', tactic: 'Initial Access', description: 'Adversaries may gain access to a system through a user visiting a website over the normal course of browsing.' },
    { id: 'T0819', name: 'Exploit Public-Facing Application', tactic: 'Initial Access', description: 'Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program.' },
    { id: 'T0866', name: 'Exploitation of Remote Services', tactic: 'Initial Access', description: 'Adversaries may exploit remote services to gain unauthorized access to internal systems.' }
  ],
  'Execution': [
    { id: 'T0821', name: 'Modify Controller Tasking', tactic: 'Execution', description: 'Adversaries may modify the tasking of a controller to allow for the execution of their own programs.' },
    { id: 'T0823', name: 'Graphical User Interface', tactic: 'Execution', description: 'Adversaries may attempt to gain access through the GUI to perform actions and execute programs.' },
    { id: 'T0874', name: 'Hooking', tactic: 'Execution', description: 'Adversaries may use hooking to load and execute malicious code within the context of another process.' }
  ],
  'Persistence': [
    { id: 'T0859', name: 'Valid Accounts', tactic: 'Persistence', description: 'Adversaries may obtain and abuse credentials of existing accounts as a means of gaining Initial Access.' },
    { id: 'T0839', name: 'Module Firmware', tactic: 'Persistence', description: 'Adversaries may install malicious or vulnerable firmware onto modular hardware devices.' },
    { id: 'T0889', name: 'Modify Program', tactic: 'Persistence', description: 'Adversaries may modify programs to establish persistence in an ICS environment.' }
  ],
  'Impact': [
    { id: 'T0826', name: 'Loss of Availability', tactic: 'Impact', description: 'Adversaries may attempt to disrupt essential components or systems to prevent owner and operator use.' },
    { id: 'T0827', name: 'Loss of Control', tactic: 'Impact', description: 'Adversaries may seek to deny, degrade, or manipulate control of a system.' },
    { id: 'T0828', name: 'Loss of Productivity and Revenue', tactic: 'Impact', description: 'Adversaries may cause loss of productivity and revenue through disruption and instability of operations.' }
  ]
};

export const TechniqueSelection: React.FC<TechniqueSelectionProps> = ({
  selectedTechniques,
  setSelectedTechniques
}) => {
  const [selectedTactic, setSelectedTactic] = useState<string>('');
  const [selectedTechnique, setSelectedTechnique] = useState<string>('');

  const availableTechniques = selectedTactic ? mockTechniques[selectedTactic] || [] : [];

  const addTechnique = () => {
    if (selectedTactic && selectedTechnique) {
      const technique = availableTechniques.find(t => t.id === selectedTechnique);
      if (technique && !selectedTechniques.find(st => st.id === technique.id)) {
        setSelectedTechniques([...selectedTechniques, technique]);
        setSelectedTechnique('');
      }
    }
  };

  const removeTechnique = (techniqueId: string) => {
    setSelectedTechniques(selectedTechniques.filter(t => t.id !== techniqueId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Technique & Tactic Selection</h2>
        <p className="text-muted-foreground">
          Select MITRE ATT&CK techniques and tactics relevant to your asset assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Add Techniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tactic" className="text-sm font-medium">
                Select Tactic
              </Label>
              <Select value={selectedTactic} onValueChange={setSelectedTactic}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a tactic" />
                </SelectTrigger>
                <SelectContent>
                  {mockTactics.map((tactic) => (
                    <SelectItem key={tactic} value={tactic}>
                      {tactic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="technique" className="text-sm font-medium">
                Select Technique
              </Label>
              <Select 
                value={selectedTechnique} 
                onValueChange={setSelectedTechnique}
                disabled={!selectedTactic}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={selectedTactic ? "Choose a technique" : "Select a tactic first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableTechniques.map((technique) => (
                    <SelectItem key={technique.id} value={technique.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{technique.id} - {technique.name}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-64">
                          {technique.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={addTechnique}
              disabled={!selectedTactic || !selectedTechnique}
              className="w-full bg-primary hover:bg-primary-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Technique
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Selected Techniques ({selectedTechniques.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTechniques.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No techniques selected yet</p>
                <p className="text-sm">Choose techniques from the dropdown to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedTechniques.map((technique) => (
                  <Card key={technique.id} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-primary border-primary">
                              {technique.id}
                            </Badge>
                            <Badge variant="secondary" className="text-accent">
                              {technique.tactic}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-foreground mb-1">
                            {technique.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {technique.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTechnique(technique.id)}
                          className="ml-2 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedTechniques.length > 0 && (
        <Card className="border-success/50 bg-success/5 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-success">
              <Target className="h-5 w-5" />
              <span className="font-medium">
                {selectedTechniques.length} technique{selectedTechniques.length > 1 ? 's' : ''} selected for assessment
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};