export interface LabTest {
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

export type InsertLabTest = Omit<LabTest, "id">;

export * from "./userSchema";

