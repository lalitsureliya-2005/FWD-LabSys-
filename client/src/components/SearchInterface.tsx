import { useState } from "react";
import { Search, User, Calendar, FileText, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface SearchInterfaceProps {
  records?: TestRecord[];
  onSearch?: (query: string) => void;
}

export default function SearchInterface({ records = [], onSearch }: SearchInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<TestRecord | null>(null);

  const filteredRecords = records.filter((record) => {
    const query = searchQuery.toLowerCase();
    return (
      record.patientName.toLowerCase().includes(query) ||
      record.patientId.toLowerCase().includes(query)
    );
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

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
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Search className="w-6 h-6 text-primary" />
            Search Patient Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by patient name or ID..."
              className="pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </CardContent>
      </Card>

      {searchQuery && (
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No records found matching "{searchQuery}"</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredRecords.map((record) => (
                <Card
                  key={record.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => setSelectedRecord(record)}
                  data-testid={`card-record-${record.patientId}`}
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{record.patientName}</h3>
                        <p className="text-sm font-mono text-muted-foreground">{record.patientId}</p>
                      </div>
                      <Badge variant="secondary">{record.testType}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{record.age}y, {record.gender}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(record.sampleReceivedTime).split(',')[0]}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedRecord && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle>Full Record Details</CardTitle>
              <Badge>{selectedRecord.testType}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patient Name</p>
                  <p className="font-semibold">{selectedRecord.patientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patient ID</p>
                  <p className="font-mono">{selectedRecord.patientId}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Age</p>
                    <p>{selectedRecord.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                    <p>{selectedRecord.gender}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Sample Received
                  </p>
                  <p className="text-sm">{formatDate(selectedRecord.sampleReceivedTime)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Sample Tested
                  </p>
                  <p className="text-sm">{formatDate(selectedRecord.sampleTestedTime)}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                <FileText className="w-3 h-3" />
                Purpose / Clinical Notes
              </p>
              <p className="text-sm bg-muted p-3 rounded-md">{selectedRecord.purpose}</p>
            </div>

            {selectedRecord.testData && selectedRecord.testData !== '{}' && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Test Parameters</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(JSON.parse(selectedRecord.testData)).map(([key, value]) => (
                    <div key={key} className="bg-muted p-2 rounded">
                      <p className="text-xs text-muted-foreground">{key}</p>
                      <p className="text-sm font-medium">{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
