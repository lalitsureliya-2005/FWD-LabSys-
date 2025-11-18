import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, User, Calendar, Clipboard } from "lucide-react";

const testTypes = {
  "CBC": ["Hemoglobin", "RBC Count", "WBC Count", "Platelet Count"],
  "Blood Glucose": ["Fasting", "Post Prandial"],
  "Lipid Profile": ["Total Cholesterol", "LDL", "HDL", "Triglycerides"],
  "Urinalysis": ["Color", "pH", "Protein", "Glucose"]
};

const formSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(1).max(120),
  gender: z.enum(["Male", "Female", "Other"]),
  testType: z.string().min(1, "Please select a test type"),
  purpose: z.string().min(5, "Purpose must be at least 5 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface NewEntryFormProps {
  onSubmit?: (data: any) => void;
}

export default function NewEntryForm({ onSubmit }: NewEntryFormProps) {
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [testFields, setTestFields] = useState<Record<string, string>>({});

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      age: 30,
      gender: "Male",
      testType: "",
      purpose: "",
    },
  });

  const handleTestChange = (value: string) => {
    setSelectedTest(value);
    setTestFields({});
    form.setValue("testType", value);
  };

  const handleSubmit = (data: FormData) => {
    const patientId = `PT${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const sampleReceivedTime = now.toISOString();
    const sampleTestedTime = new Date(now.getTime() + 60000).toISOString();

    const fullData = {
      ...data,
      patientId,
      sampleReceivedTime,
      sampleTestedTime,
      testData: JSON.stringify(testFields),
    };

    console.log("Form submitted:", fullData);
    if (onSubmit) {
      onSubmit(fullData);
    }

    form.reset();
    setSelectedTest("");
    setTestFields({});
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Clipboard className="w-6 h-6 text-primary" />
          New Patient Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName" className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Patient Name
              </Label>
              <Input
                id="patientName"
                placeholder="Enter patient name"
                data-testid="input-patient-name"
                {...form.register("patientName")}
              />
              {form.formState.errors.patientName && (
                <p className="text-sm text-destructive">{form.formState.errors.patientName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  data-testid="input-age"
                  {...form.register("age", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  defaultValue="Male"
                  onValueChange={(value) => form.setValue("gender", value as any)}
                  className="flex gap-4"
                  data-testid="radio-gender"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male" className="font-normal">Male</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female" className="font-normal">Female</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="Other" id="other" />
                    <Label htmlFor="other" className="font-normal">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testType">Lab Test Type</Label>
              <Select onValueChange={handleTestChange} value={selectedTest}>
                <SelectTrigger id="testType" data-testid="select-test-type">
                  <SelectValue placeholder="Select a test" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(testTypes).map((test) => (
                    <SelectItem key={test} value={test}>
                      {test}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.testType && (
                <p className="text-sm text-destructive">{form.formState.errors.testType.message}</p>
              )}
            </div>

            {selectedTest && (
              <div className="space-y-3 p-4 bg-accent rounded-md border border-accent-border">
                <h3 className="font-medium text-sm text-accent-foreground">Test Parameters</h3>
                <div className="grid grid-cols-2 gap-3">
                  {testTypes[selectedTest as keyof typeof testTypes].map((field) => (
                    <div key={field} className="space-y-1">
                      <Label htmlFor={field} className="text-xs">{field}</Label>
                      <Input
                        id={field}
                        placeholder={`Enter ${field.toLowerCase()}`}
                        value={testFields[field] || ""}
                        onChange={(e) => setTestFields({ ...testFields, [field]: e.target.value })}
                        data-testid={`input-${field.toLowerCase().replace(/\s+/g, "-")}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose / Clinical Notes</Label>
              <Textarea
                id="purpose"
                placeholder="Enter the reason for this test..."
                rows={3}
                data-testid="input-purpose"
                {...form.register("purpose")}
              />
              {form.formState.errors.purpose && (
                <p className="text-sm text-destructive">{form.formState.errors.purpose.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full gap-2" data-testid="button-submit">
            <Save className="w-4 h-4" />
            Save Patient Record
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
