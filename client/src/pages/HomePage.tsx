import { useState } from "react";
import NewEntryForm from "@/components/NewEntryForm";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    console.log("New patient entry:", data);
    
    toast({
      title: "Record Saved Successfully",
      description: `Patient ${data.patientName} (${data.patientId}) has been added to the system.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-8 px-4">
      <NewEntryForm onSubmit={handleSubmit} />
    </div>
  );
}
