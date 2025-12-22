import { useState } from "react";
import { List, Filter, User, Calendar, FileText, Clock, TestTube2, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  onDeleteRecord?: (recordId: string) => void;
}

const testTypes = ["All Tests", "CBC", "Blood Glucose", "Lipid Profile", "Urinalysis"];

export default function RecordsView({ records = [], onDeleteRecord }: RecordsViewProps) {
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
    <div className="max-w-7xl mx-auto space-y-6 relative">
      <img src="/assets/healthy-2.svg" alt="sticker" className="pointer-events-none absolute -right-6 -top-6 w-28 opacity-80 animate-float-slower" />
      <Card className="card-entrance theme-transition">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Export the currently filtered records as CSV
                  const rows = filteredRecords.map(r => ({
                    id: r.id,
                    patientId: r.patientId,
                    patientName: r.patientName,
                    age: r.age,
                    gender: r.gender,
                    testType: r.testType,
                    purpose: r.purpose,
                    sampleReceivedTime: r.sampleReceivedTime,
                    sampleTestedTime: r.sampleTestedTime,
                    testData: r.testData,
                  }));
                  if (rows.length === 0) return;
                  const header = Object.keys(rows[0]);
                  const csv = [header.join(",")]
                    .concat(rows.map(r => header.map(h => `"${String((r as any)[h] ?? "").replace(/"/g, '""')}"`).join(",")))
                    .join("\n");

                  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `lab-records-${new Date().toISOString().slice(0,10)}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
                aria-label="Export CSV"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredRecords.length} {filteredRecords.length === 1 ? 'record' : 'records'}
          </p>
        </CardHeader>
      </Card>

      {filteredRecords.length === 0 ? (
        <Card className="card-entrance theme-transition">
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
            <Card key={record.id} className="hover-elevate card-entrance theme-transition" data-testid={`card-test-${record.patientId}`}>
              <CardContent className="p-6">
                {onDeleteRecord && (
                  <div className="flex justify-end mb-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          aria-label={`Delete record for ${record.patientName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Patient Record</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the record for <strong>{record.patientName}</strong> (ID: {record.patientId})?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteRecord(record.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Record
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
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
