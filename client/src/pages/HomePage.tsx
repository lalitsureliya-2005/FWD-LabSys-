import { useState } from "react";
import NewEntryForm from "@/components/NewEntryForm";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestTube2, Users, Activity, TrendingUp } from "lucide-react";
import { calculateStats } from "@/data/mockData";

export default function HomePage() {
  const { toast } = useToast();
  const statsData = calculateStats();

  const handleSubmit = (data: any) => {
    console.log("New patient entry:", data);

    toast({
      title: "Record Saved Successfully",
      description: `Patient ${data.patientName} (${data.patientId}) has been added to the system.`,
    });
  };

  const stats = [
    { icon: Users, label: "Total Patients", value: statsData.totalPatients.toString(), color: "text-blue-600" },
    { icon: TestTube2, label: "Tests Today", value: statsData.testsToday.toString(), color: "text-green-600" },
    { icon: Activity, label: "Active Cases", value: statsData.activeCases.toString(), color: "text-orange-600" },
    { icon: TrendingUp, label: "This Month", value: "+12%", color: "text-purple-600" },
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TestTube2 className="w-4 h-4" />
            Lab Management System
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            New Patient Entry
          </h1>
          <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
            Efficiently manage patient records and lab test data with our comprehensive system.
            Add new entries, track results, and maintain accurate medical records.
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

        {/* Main Form Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="glass-effect border-0 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 card-entrance theme-transition">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4">
                  <TestTube2 className="w-4 h-4 mr-2" />
                  Patient Information
                </Badge>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Create New Patient Record
                </h2>
                <p className="text-muted-foreground">
                  Fill in the patient details and test information below
                </p>
              </div>
              <NewEntryForm onSubmit={handleSubmit} />
            </CardContent>
          </Card>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute top-1/2 left-8 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-bounce-gentle" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-12 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-green-400 rounded-full opacity-50 animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  );
}
