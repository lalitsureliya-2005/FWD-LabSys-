import { useState, useEffect } from "react";
import RecordsView from "@/components/RecordsView";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { List, BarChart3, FileText, Calendar } from "lucide-react";


export default function RecordsPage() {

  interface RecordType {
    id: string;
    patientId: string;
    patientName: string;
    email: string;
    age: number;
    gender: string;
    testType: string;
    purpose: string;
    sampleReceivedTime: string;
    sampleTestedTime: string;
    testData: string;
    doctorName: string;
  }

  // Fetch test results from backend API
  const [records, setRecords] = useState<RecordType[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/results", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch test results");
        return res.json();
      })
      .then((data) => {
        // Map backend test result to RecordsView format
        const mapped = data.map((result: any) => ({
          id: result._id,
          patientId: result.shortId || result.patient?._id || '', // Prefer shortId
          patientName: result.patient?.name || '',
          email: result.patient?.email || '',
          age: result.patient?.age || '',
          gender: result.patient?.gender || '',
          testType: result.test?.name || '',
          purpose: result.test?.purpose || '',
          sampleReceivedTime: result.createdAt || '',
          sampleTestedTime: result.updatedAt || '',
          testData: result.value || '',
          doctorName: result.doctor?.username || 'System',
        }));
        setRecords(mapped);
      })
      .catch((err) => {
        setRecords([]);
      });
  }, []);

  const handleDeleteRecord = (recordId: string) => {
    setRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
  };

  // Calculate stats from API data
  const statsData = {
    totalRecords: records.length,
    testTypes: new Set(records.map(r => r.testType)).size,
    thisWeekRecords: records.filter(r => {
      const date = new Date(r.sampleReceivedTime);
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= oneWeekAgo;
    }).length
  };

  const stats = [
    { icon: List, label: "Total Records", value: statsData.totalRecords.toString(), color: "text-violet-600" },
    { icon: BarChart3, label: "Test Types", value: statsData.testTypes.toString(), color: "text-pink-600" },
    { icon: FileText, label: "Reports Generated", value: records.filter(r => r.id).length.toString(), color: "text-teal-600" }, // Simplified for now
    { icon: Calendar, label: "This Week", value: statsData.thisWeekRecords.toString(), color: "text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Decorative medical icons */}
      <div className="absolute inset-0 pointer-events-none">
        <img src="/assets/healthy-1.svg" alt="medical icon" className="absolute top-20 left-20 w-16 h-16 opacity-60 animate-float-slow" />
        <img src="/assets/healthy-2.svg" alt="medical icon" className="absolute bottom-20 right-20 w-12 h-12 opacity-50 animate-float-slower" />
        <img src="/assets/healthy-1.svg" alt="medical icon" className="absolute top-1/3 right-32 w-10 h-10 opacity-40 animate-bounce-gentle" />
        <img src="/assets/healthy-2.svg" alt="medical icon" className="absolute bottom-1/3 left-32 w-14 h-14 opacity-45 animate-float-slow" />
      </div>

      <div className="relative w-full max-w-7xl z-10">
        <div className="max-w-7xl mx-auto px-4 relative">

          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <List className="w-4 h-4" />
              Records Management
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
              Test Records Overview
            </h1>
            <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive view of all patient test records with advanced filtering and export capabilities.
              Monitor lab activities, track test results, and manage medical data efficiently.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="hover-elevate card-entrance theme-transition" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6 text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Records View Section */}
          <div className="max-w-7xl mx-auto">
            <Card className="glass-effect border-0 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 card-entrance theme-transition">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Badge variant="secondary" className="mb-4">
                    <FileText className="w-4 h-4 mr-2" />
                    Medical Database
                  </Badge>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Patient Test Records
                  </h2>
                  <p className="text-muted-foreground">
                    Browse, filter, and export comprehensive medical test data
                  </p>
                </div>
                <RecordsView records={records} onDeleteRecord={handleDeleteRecord} />
              </CardContent>
            </Card>
          </div>

          {/* Additional decorative elements */}
          <div className="absolute top-1/3 left-8 w-2 h-2 bg-violet-400 rounded-full opacity-60 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 right-16 w-1 h-1 bg-pink-400 rounded-full opacity-40 animate-bounce-gentle" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-teal-400 rounded-full opacity-50 animate-bounce-gentle" style={{ animationDelay: '2.5s' }}></div>
        </div>
      </div>
    </div>
  );
}
