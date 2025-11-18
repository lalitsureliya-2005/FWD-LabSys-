import { useState } from "react";
import { List, Filter, User, Calendar, FileText, Clock, TestTube2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TestRecord {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  testType: string;
  purpose: string;
  sampleReceivedTime: string;
  sampleTestedTime: string;
  testData: string;
}

interface RecordsViewProps {
  records?: TestRecord[];
}

const testTypes = ["All Tests", "CBC", "Blood Glucose", "Lipid Profile", "Urinalysis"];

export default function RecordsView({ records = [] }: RecordsViewProps) {
  const [filterType, setFilterType] = useState("All Tests");

  const filteredRecords = filterType === "All Tests"
    ? records
    : records.filter(r => r.testType === filterType);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-2xl flex items-center gap-2">
              <List className="w-6 h-6 text-primary" />
              Test Records
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48" data-testid="select-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {testTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredRecords.length} {filteredRecords.length === 1 ? 'record' : 'records'}
          </p>
        </CardHeader>
      </Card>

      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <TestTube2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No records found</h3>
            <p className="text-muted-foreground">
              {filterType === "All Tests" 
                ? "No test records available yet. Create a new entry to get started."
                : `No ${filterType} records found. Try a different filter.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover-elevate" data-testid={`card-test-${record.patientId}`}>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Patient Info</span>
                    </div>
                    <h3 className="font-semibold text-lg">{record.patientName}</h3>
                    <p className="font-mono text-sm text-muted-foreground">{record.patientId}</p>
                    <div className="flex gap-3 text-sm">
                      <span className="text-muted-foreground">{record.age}y</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{record.gender}</span>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <TestTube2 className="w-4 h-4" />
                      <span className="font-medium">Test Details</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>{record.testType}</Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        Purpose
                      </p>
                      <p className="text-sm text-foreground">{record.purpose}</p>
                    </div>

                    {record.testData && record.testData !== '{}' && (
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-1">Parameters</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(JSON.parse(record.testData)).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="bg-muted px-2 py-1 rounded text-xs">
                              <span className="font-medium">{key}:</span> {value as string}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Timeline</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Sample Received</p>
                        <p className="text-sm font-medium">{formatDate(record.sampleReceivedTime)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sample Tested</p>
                        <p className="text-sm font-medium">{formatDate(record.sampleTestedTime)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
