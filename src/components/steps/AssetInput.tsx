import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Server, Monitor, Cpu } from 'lucide-react';
import { AssetData } from '../RiskAssessmentStepper';

interface AssetInputProps {
  assetData: AssetData;
  setAssetData: (data: AssetData) => void;
}

const assetTypes = [
  { value: 'hmi', label: 'Human Machine Interface (HMI)', icon: Monitor },
  { value: 'plc', label: 'Programmable Logic Controller (PLC)', icon: Cpu },
  { value: 'workstation', label: 'Engineering Workstation', icon: Server },
  { value: 'scada', label: 'SCADA System', icon: Database },
  { value: 'historian', label: 'Data Historian', icon: Database },
  { value: 'rtu', label: 'Remote Terminal Unit (RTU)', icon: Cpu }
];

export const AssetInput: React.FC<AssetInputProps> = ({ assetData, setAssetData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Asset Definition</h2>
        <p className="text-muted-foreground">
          Define the ICS asset you want to assess for cybersecurity risks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Asset Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="assetName" className="text-sm font-medium">
                Asset Name *
              </Label>
              <Input
                id="assetName"
                placeholder="e.g., Main Control HMI, Production PLC-01"
                value={assetData.name}
                onChange={(e) => setAssetData({ ...assetData, name: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter a descriptive name for your asset
              </p>
            </div>

            <div>
              <Label htmlFor="assetType" className="text-sm font-medium">
                Asset Type *
              </Label>
              <Select 
                value={assetData.type} 
                onValueChange={(value) => setAssetData({ ...assetData, type: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Choose the type that best describes your asset
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-muted/50">
          <CardHeader>
            <CardTitle className="text-primary">Asset Type Descriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-foreground">HMI:</strong>
                <span className="text-muted-foreground ml-1">
                  User interface for monitoring and controlling industrial processes
                </span>
              </div>
              <div>
                <strong className="text-foreground">PLC:</strong>
                <span className="text-muted-foreground ml-1">
                  Industrial computer for automation of electromechanical processes
                </span>
              </div>
              <div>
                <strong className="text-foreground">Workstation:</strong>
                <span className="text-muted-foreground ml-1">
                  Computer used for engineering, programming, and maintenance tasks
                </span>
              </div>
              <div>
                <strong className="text-foreground">SCADA:</strong>
                <span className="text-muted-foreground ml-1">
                  System for remote monitoring and control of industrial processes
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {assetData.name && assetData.type && (
        <Card className="border-success/50 bg-success/5 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-success">
              <Database className="h-5 w-5" />
              <span className="font-medium">Asset Ready:</span>
              <span className="text-foreground">
                {assetData.name} ({assetTypes.find(t => t.value === assetData.type)?.label})
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};